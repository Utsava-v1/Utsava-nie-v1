import { useEffect, useState } from 'react';
import { doc, getDoc, getDocs, query, where, collectionGroup, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardEventCard from '../components/DashboardEventCard';
import { useAuth } from '../contexts/AuthContext';

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
      toast.error('Please log in to view your profile.');
      navigate('/login');
      return;
    }

    const fetchStudentData = async () => {
      try {
        console.log('Current user:', { uid: currentUser.uid, email: currentUser.email });

        let studentData = null;

        // 1. Try by UID first (most reliable since document ID is uid)
        const studentDocRef = doc(db, 'students', currentUser.uid);
        const studentDocSnap = await getDoc(studentDocRef);
        if (studentDocSnap.exists()) {
          console.log('UID query succeeded:', studentDocSnap.data());
          studentData = studentDocSnap.data();
          studentData.id = studentDocSnap.id;
        } else {
          console.log('UID query failed: No document found at /students/', currentUser.uid);
        }

        // 2. Fallback: Try by email
        if (!studentData) {
          const normalizedEmail = currentUser.email.toLowerCase();
          console.log('Trying email query with:', normalizedEmail);
          const studentQuery = query(
            collection(db, 'students'),
            where('email', '==', normalizedEmail)
          );

          const unsubscribeStudent = onSnapshot(studentQuery, (studentSnap) => {
            console.log('Email query snapshot:', studentSnap.docs.map(doc => doc.data()));
            if (!studentSnap.empty) {
              studentData = studentSnap.docs[0].data();
              studentData.id = studentSnap.docs[0].id;
              console.log('Email query succeeded:', studentData);
            } else {
              console.log('Email query failed: No documents found for email', normalizedEmail);
            }
          }, (err) => {
            console.error('Email query error:', err.message);
            toast.error('Failed to fetch profile by email: ' + err.message);
          });
        }

        // 3. Fallback: Try by USN
        if (!studentData) {
          console.log('Trying USN query with:', usn);
          const usnQuery = query(
            collection(db, 'students'),
            where('usn', '==', usn)
          );
          const usnSnap = await getDocs(usnQuery);
          if (!usnSnap.empty) {
            studentData = usnSnap.docs[0].data();
            studentData.id = usnSnap.docs[0].id;
            console.log('USN query succeeded:', studentData);
          } else {
            console.log('USN query failed: No documents found for USN', usn);
          }
        }

        if (!studentData) {
          toast.error('No student profile found for this user.');
          setLoading(false);
          return;
        }

        // Validate USN from route (allow if UID matches to prevent redirect)
        if (studentData.usn !== usn && studentData.id !== currentUser.uid) {
          toast.error('Unauthorized access to profile.');
          navigate('/home');
          return;
        }

        setStudent(studentData);

        // 4. Get registrations by userId using collectionGroup
        const registrationsQuery = query(
          collectionGroup(db, 'registrations'),
          where('userId', '==', currentUser.uid)
        );

        const unsubscribeRegistrations = onSnapshot(registrationsQuery, async (registrationsSnap) => {
          const now = new Date();
          const allEvents = [];

          // 5. Get event details for each registration
          for (const reg of registrationsSnap.docs) {
            const eventId = reg.ref.parent.parent.id;
            const eventDoc = await getDoc(doc(db, 'events', eventId));

            if (eventDoc.exists()) {
              const eventData = eventDoc.data();
              allEvents.push({
                id: eventDoc.id,
                ...eventData,
                registrationDate: reg.data().registeredAt,
              });
            }
          }

          // 6. Separate into upcoming and past events
          const upcoming = allEvents.filter((event) =>
            new Date(event.date.toDate?.() || event.date) >= now
          );
          const past = allEvents.filter((event) =>
            new Date(event.date.toDate?.() || event.date) < now
          );

          setUpcomingEvents(upcoming);
          setPastEvents(past);
          setLoading(false);
        }, (err) => {
          toast.error('Failed to fetch events: ' + err.message);
          setLoading(false);
        });

        return () => unsubscribeRegistrations();
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

          <h2 className="text-2xl font-bold mb-2">{student.displayName}</h2>
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
                participants={event.participants}
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
                participants={event.participants}
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