import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import DashboardEventCard from '../components/DashboardEventCard';
import { useAuth } from '../contexts/AuthContext';

const OrganizerDashboard = () => {
    const { organizerName } = useParams();
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [organizer, setOrganizer] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrganizerData = async () => {
        try {
            setIsLoading(true);
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
            setError('Failed to fetch events. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizerData();
    }, [organizerName, navigate]);

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }

        try {
            // First delete all registrations for this event
            const registrationsQuery = query(
                collection(db, 'registrations'),
                where('event_id', '==', eventId)
            );
            const registrationsSnapshot = await getDocs(registrationsQuery);
            
            // Delete all registrations
            const deletePromises = registrationsSnapshot.docs.map(doc => 
                deleteDoc(doc.ref)
            );
            await Promise.all(deletePromises);

            // Then delete the event
            await deleteDoc(doc(db, 'events', eventId));
            
            // Refresh the events list
            await fetchOrganizerData();
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('Failed to delete event. Please try again.');
        }
    };

    if (isLoading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
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
                            <div key={event.id} className="relative">
                                <DashboardEventCard
                                    id={event.id}
                                    title={event.name}
                                    date={event.date.toDate?.().toLocaleDateString() || 'Invalid Date'}
                                    type={event.type}
                                    participants={event.participants}
                                    isUpcoming={true}
                                    venue={event.venue}
                                    description={event.description}
                                    organizing_group_id={event.organizing_group_id}
                                />
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <Link
                                        to={`/edit-event/${event.id}`}
                                        className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs hover:bg-blue-700 transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        to={`/manage-event/${event.id}`}
                                        className="bg-green-600 text-white px-2 py-0.5 rounded text-xs hover:bg-green-700 transition-colors"
                                    >
                                        Manage
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="bg-red-600 text-white px-2 py-0.5 rounded text-xs hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
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
                            <div key={event.id} className="relative">
                                <DashboardEventCard
                                    id={event.id}
                                    title={event.name}
                                    date={event.date.toDate?.().toLocaleDateString() || 'Invalid Date'}
                                    type={event.type}
                                    participants={event.participants}
                                    isUpcoming={false}
                                    venue={event.venue}
                                    description={event.description}
                                    organizing_group_id={event.organizing_group_id}
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Link
                                        to={`/manage-event/${event.id}`}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center gap-1 shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Stats
                                    </Link>
                                    <Link
                                        to={`/event-feedback/${event.id}`}
                                        className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 transition-colors flex items-center gap-1 shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                        Feedback
                                    </Link>
                                </div>
                            </div>
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
