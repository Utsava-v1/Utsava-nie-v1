import { useEffect, useState } from 'react';
import { doc, getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase';
import DashboardEventCard from '../components/DashboardEventCard';
import { useAuth } from '../contexts/AuthContext'; // Assuming you have an Auth context

const StudentProfile = () => {
  const { currentUser } = useAuth();
  const [student, setStudent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // 1. Get student document by email
        const studentQuery = query(
          collection(db, 'students'),
          where('email', '==', currentUser.email)
        );
        const studentSnap = await getDocs(studentQuery);

        if (studentSnap.empty) return;

        const studentDoc = studentSnap.docs[0];
        const studentData = studentDoc.data();
        setStudent(studentData);

        const studentRef = studentDoc.ref;

        // 2. Get feedback entries where student_id matches
        const feedbackQuery = query(
          collection(db, 'feedback'),
          where('student_id', '==', studentRef)
        );
        const feedbackSnap = await getDocs(feedbackQuery);

        const now = new Date();
        const allEvents = [];

        for (const fb of feedbackSnap.docs) {
          const eventRef = fb.data().event_id;
          const eventDoc = await getDoc(eventRef);

          if (eventDoc.exists()) {
            const eventData = eventDoc.data();
            allEvents.push({ id: eventDoc.id, ...eventData });
          }
        }

        const upcoming = allEvents.filter(event => new Date(event.date.toDate?.() || event.date) >= now);
        const past = allEvents.filter(event => new Date(event.date.toDate?.() || event.date) < now);

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (err) {
        console.error('Failed to fetch student profile/events:', err);
      }
    };

    if (currentUser?.email) fetchStudentData();
  }, [currentUser]);

  if (!student) return <p>Loading profile...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile Info */}
      <div className="bg-[#1D3557] text-white p-5 rounded-md shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-2">{student.name}</h2>
        <p>Email: {student.email}</p>
        <p>USN: {student.usn}</p>
        <p>Semester: {student.semester}</p>
        <p>Contact: {student.contact_no}</p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Upcoming Registered Events</h3>
        <div className="flex gap-4 flex-wrap">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <DashboardEventCard
                key={event.id}
                id={event.id}
                title={event.name}
                date={event.date}
                type={event.type}
                participants={event.participants}
                isUpcoming={true}
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
            pastEvents.map(event => (
              <DashboardEventCard
                key={event.id}
                id={event.id}
                title={event.name}
                date={event.date}
                type={event.type}
                participants={event.participants}
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
