import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, getDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const EventCard = ({ id, name, organizer, date, time, image, onDetailsClick, onRegisterClick, organizing_group_id }) => {
    const { userProfile } = useAuth();
    const navigate = useNavigate();
    const defaultImage = '/images/hotAirBalloons.jpg';
    const imgSrc = image || defaultImage;
    const eventName = name || "-no event name-";
    const [registrationCount, setRegistrationCount] = useState(0);
    const [organizerName, setOrganizerName] = useState(organizer);
    const [organizerId, setOrganizerId] = useState('');
    const [showOrganizerDetails, setShowOrganizerDetails] = useState(false);
    const [organizerDetails, setOrganizerDetails] = useState(null);
    const [organizerEvents, setOrganizerEvents] = useState([]);
    const isOrganizerView = userProfile?.role === 'organizer';

    useEffect(() => {
        if (!id) return;

        // Set up real-time listener for registration changes
        const registrationsRef = collection(db, 'registrations');
        const q = query(registrationsRef, where('event_id', '==', id));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setRegistrationCount(snapshot.size);
        }, (error) => {
            console.error("Error listening to registrations:", error);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [id]);

    const handleOrganizerClick = async (e) => {
        e.preventDefault();
        if (userProfile?.role === 'organizer' && organizerId === userProfile.organizing_group_id) {
            return;
        }

        try {
            // Fetch organizer details
            const organizerQuery = query(
                collection(db, 'organizing_group'),
                where('name', '==', organizer)
            );
            const organizerSnapshot = await getDocs(organizerQuery);
            
            if (!organizerSnapshot.empty) {
                const organizerDoc = organizerSnapshot.docs[0];
                const organizerData = organizerDoc.data();
                setOrganizerId(organizerDoc.id);
                setOrganizerDetails(organizerData);

                // Fetch organizer's events
                const eventsQuery = query(
                    collection(db, 'events'),
                    where('organizing_group_id', '==', organizerDoc.id)
                );
                const eventsSnapshot = await getDocs(eventsQuery);
                const events = eventsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrganizerEvents(events);
                setShowOrganizerDetails(true);
            }
        } catch (err) {
            console.error('Error fetching organizer details:', err);
        }
    };

    return (
        <div className={`event-card ${isOrganizerView ? 'bg-gradient-to-br from-[#1D3557] to-[#2F3E46] text-white' : 'bg-white text-[#1D3557]'} rounded-lg min-w-80 shadow-lg transition-transform transform hover:translate-y-[-5px] hover:shadow-xl w-[calc(33.333%-20px)] relative`}>
            <div className="relative">
                <img src={imgSrc} alt="Event Image" className="w-full object-cover rounded-t-lg h-48" />
                {isOrganizerView && (
                    <div className="absolute top-2 right-2 bg-[#E63946] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {registrationCount} Registered
                    </div>
                )}
            </div>
            <div className="event-card-body p-5 text-left">
                <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-2xl mb-2 h-10 w-full overflow-hidden ${isOrganizerView ? 'text-white' : 'text-[#1D3557]'}`}>{eventName}</h3>
                    {!isOrganizerView && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {registrationCount} registrations
                        </span>
                    )}
                </div>
                <button
                    onClick={handleOrganizerClick}
                    className={`organizer text-lg mb-2 hover:underline transition-colors ${isOrganizerView ? 'text-[#A8DADC] hover:text-white' : 'text-[#00a8ad] hover:text-[#008489]'}`}
                >
                    By {organizer}
                </button>
                <div className={`date-time text-lg mb-5 ${isOrganizerView ? 'text-[#A8DADC]' : 'text-[#2F3E46]'}`}>
                    Date: {date} | Time: {time}
                </div>
                <div className='flex flex-wrap gap-2'>
                    {!isOrganizerView && (
                        <button
                            onClick={onRegisterClick}
                            className="btn bg-[#1D3557] text-white py-2.5 px-6 text-base uppercase hover:bg-[#E63946] transition-colors rounded-md flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Register
                        </button>
                    )}
                    <button
                        onClick={onDetailsClick}
                        className={`btn py-2.5 px-6 text-base uppercase transition-colors rounded-md flex items-center gap-2 ${
                            isOrganizerView 
                                ? 'bg-[#E63946] text-white hover:bg-[#F1FAEE] hover:text-[#1D3557]' 
                                : 'bg-[#1D3557] text-white hover:bg-[#E63946]'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Details
                    </button>
                </div>
            </div>

            {/* Organizer Details Modal */}
            {showOrganizerDetails && organizerDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-[#1D3557]">{organizerDetails.name}</h2>
                            <button
                                onClick={() => setShowOrganizerDetails(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">About</h3>
                                <p className="text-gray-600">{organizerDetails.desc}</p>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Contact</h3>
                                <p className="text-gray-600">Email: {organizerDetails.email}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Organized Events</h3>
                                <div className="space-y-2">
                                    {organizerEvents.map(event => (
                                        <div key={event.id} className="bg-gray-50 p-3 rounded-lg">
                                            <h4 className="font-medium text-[#1D3557]">{event.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                Date: {event.date.toDate?.().toLocaleDateString() || event.date}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCard;
    