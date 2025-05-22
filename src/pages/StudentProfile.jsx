import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardEventCard from '../components/DashboardEventCard';
import { useAuth } from '../contexts/AuthContext';
import { getEventsByIds } from '../utils/firestore';

const StudentProfile = () => {
  const { currentUser } = useAuth();
  const { usn } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.email) {
      console.log('No user logged in, redirecting to /login');
      toast.error('Please log in to view your profile.');
      navigate('/login');
      return;
    }

    const fetchStudentData = async () => {
      try {
        console.log('Current user:', { uid: currentUser.uid, email: currentUser.email, usn:currentUser.usn });

        // Fetch student by UID
        const studentDocRef = doc(db, 'students', currentUser.uid);
        const studentDocSnap = await getDoc(studentDocRef);
        if (!studentDocSnap.exists()) {
          console.error('Student document not found:', currentUser.uid);
          toast.error('No student profile found. Please complete your profile.');
          navigate('/student-signup');
          return;
        }

        const studentData = { id: studentDocSnap.id, ...studentDocSnap.data() };

        // Validate USN from route
        // if (studentData.usn !== usn) {
        //   console.warn('USN mismatch:', { routeUsn: usn, studentUsn: studentData.usn });
        //   toast.error('Unauthorized access to profile.');
        //   navigate('/home');
        //   return;
        // }

        setStudent(studentData);

        // Fetch events from registrations array
        const registrations = studentData.registrations || [];
        console.log('Student registrations:', registrations);

        const allEvents = await getEventsByIds(registrations);
        console.log('Fetched events:', allEvents);

        // Separate into upcoming and past events
        const now = new Date();
        const upcoming = allEvents.filter((event) =>
          new Date(event.date.toDate?.() || event.date) >= now
        );
        const past = allEvents.filter((event) =>
          new Date(event.date.toDate?.() || event.date) < now
        );

        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setLoading(false);
      } catch (err) {
        console.error('Fetch student data error:', err.message);
        toast.error('Error loading profile: ' + err.message);
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [currentUser, usn, navigate]);

  if (loading) return <p className="text-center text-gray-500 text-2xl">Loading profile...</p>;
  if (!student) return <p className="text-center text-gray-500 text-2xl p-5">No profile data available.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile Info */}
      <div className="bg-[#1D3557] text-white flex items-center justify-start gap-10 p-10 rounded-md shadow-md mb-8">
        <div className='h-30 w-30 border rounded-full bg-[url("/images/studentProfile.jpeg")] bg-cover bg-center'></div>
        <div>
          <h2 className="text-2xl font-bold mb-2">{student.displayName || student.name}</h2>
          <p>Email: {student.email}</p>
          <p>USN: {student.usn}</p>
          <p>Semester: {student.semester || 'N/A'}</p>
          <p>Contact: {student.contact_no || 'N/A'}</p>
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Upcoming Registered Events</h3>
        <div className="flex gap-4 flex-wrap">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <DashboardEventCard
                key={event.id}
                id={event.id}
                title={event.name}
                date={event.date.toDate?.().toLocaleDateString() || event.date}
                type={event.type}
                registrations={event.registrations || 0}
                isUpcoming={true}
                venue={event.venue}
                description={event.description}
              />
            ))
          ) : (
            <p className="text-gray-500">No upcoming events.</p>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Past Registered Events</h3>
        <div className="flex gap-4 flex-wrap">
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <DashboardEventCard
                key={event.id}
                id={event.id}
                title={event.name}
                date={event.date.toDate?.().toLocaleDateString() || event.date}
                type={event.type}
                registrations={event.registrations || 0}
                isUpcoming={false}
                venue={event.venue}
                description={event.description}
              />
            ))
          ) : (
            <p className="text-gray-500">No past events.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentProfile;