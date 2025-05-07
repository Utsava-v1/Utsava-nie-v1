import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import DashboardEventCard from '../components/DashboardEventCard';

const OrganizerDashboard = () => {
    const { organizerName } = useParams();
    const navigate = useNavigate();
    const [organizer, setOrganizer] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    useEffect(() => {
        const fetchOrganizerData = async () => {
            try {
                // Fetch the organizer document
                const organizerQuery = query(
                    collection(db, 'organizing_group'),
                    where('name', '==', organizerName.replace(/-/g, ' '))
                );
                const querySnapshot = await getDocs(organizerQuery);

                if (querySnapshot.empty) {
                    navigate('/404');
                    return;
                }

                const organizerDoc = querySnapshot.docs[0];
                const organizerData = organizerDoc.data();
                const organizerId = organizerDoc.id;
                setOrganizer({ ...organizerData, id: organizerId });

                // Fetch all events
                const eventsSnap = await getDocs(collection(db, 'events'));

                // Filter events where organizing_group_id.id === organizerId
                const organizerEvents = [];

                for (const docSnap of eventsSnap.docs) {
                    const data = docSnap.data();
                    const orgRef = data.organizing_group_id;

                    let orgId = null;
                    if (typeof orgRef === 'string') {
                        orgId = orgRef;
                    } else if (orgRef?.id) {
                        orgId = orgRef.id;
                    }

                    if (orgId === organizerId) {
                        organizerEvents.push({ id: docSnap.id, ...data });
                    }
                }

                // Separate into upcoming and past
                const now = new Date();
                const upcoming = organizerEvents.filter(event =>
                    new Date(event.date.toDate?.() || event.date) >= now
                );
                const past = organizerEvents.filter(event =>
                    new Date(event.date.toDate?.() || event.date) < now
                );

                setUpcomingEvents(upcoming);
                setPastEvents(past);
            } catch (err) {
                console.error('Error fetching organizer or events:', err);
            }
        };

        fetchOrganizerData();
    }, [organizerName, navigate]);

    if (!organizer) return null;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Club Info Section */}
            <div className="bg-[#1D3557] text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                    <img
                        src={organizer.logo_url || '/images/default-logo.png'}
                        alt={organizer.name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{organizer.name}</h1>
                        <p className="text-sm mt-1">Email: <span className="font-medium">{organizer.email}</span></p>
                        <p className="mt-2 text-sm">{organizer.desc}</p>
                    </div>
                </div>
            </div>

            {/* Create Event Button */}
            <div className="flex justify-end mt-6">
                <Link
                    to={`/${organizer.name.toLowerCase().replace(/\s+/g, '-')}/create-event`}
                    className="bg-[#E63946] text-white px-4 py-2 rounded-md hover:bg-[#D62828] transition"
                >
                    + Create Event
                </Link>
            </div>

            {/* Upcoming Events */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                <div className="flex gap-4 flex-wrap">
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.map(event => (
                            <DashboardEventCard
                                key={event.id}
                                id={event.id}
                                title={event.name}
                                date={event.date.toDate?.().toLocaleDateString() || 'Invalid Date'}
                                type={event.type}
                                participants={event.participants}
                                isUpcoming={true}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">No upcoming events</p>
                    )}
                </div>
            </div>

            {/* Past Events */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Past Events</h2>
                <div className="flex gap-4 flex-wrap">
                    {pastEvents.length > 0 ? (
                        pastEvents.map(event => (
                            <DashboardEventCard
                                key={event.id}
                                id={event.id}
                                title={event.name}
                                date={event.date.toDate?.().toLocaleDateString() || 'Invalid Date'}
                                type={event.type}
                                participants={event.participants}
                            />
                        ))

                    ) : (
                        <p className="text-gray-500">No past events</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
