import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const DashboardEventCard = ({ id, title, date, type, participants, isUpcoming, venue, description, organizing_group_id }) => {
    const { userProfile } = useAuth();
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false);
    const [registrationCount, setRegistrationCount] = useState(0);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registrationId, setRegistrationId] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [organizerName, setOrganizerName] = useState('');
    const [organizerId, setOrganizerId] = useState('');
    const [hasGivenFeedback, setHasGivenFeedback] = useState(false);

    useEffect(() => {
        const fetchOrganizerData = async () => {
            try {
                let orgId = organizing_group_id;
                if (typeof organizing_group_id === 'object' && organizing_group_id.id) {
                    orgId = organizing_group_id.id;
                }
                
                const organizerDoc = await getDoc(doc(db, 'organizing_group', orgId));
                if (organizerDoc.exists()) {
                    const data = organizerDoc.data();
                    setOrganizerName(data.name);
                    setOrganizerId(organizerDoc.id);
                }
            } catch (err) {
                console.error('Error fetching organizer data:', err);
            }
        };

        fetchOrganizerData();
    }, [organizing_group_id]);

    useEffect(() => {
        const fetchRegistrationData = async () => {
            if (!showDetails) return;
            
            try {
                // Get total registrations
                const registrationsQuery = query(
                    collection(db, 'registrations'),
                    where('event_id', '==', id)
                );
                const registrationsSnapshot = await getDocs(registrationsQuery);
                setRegistrationCount(registrationsSnapshot.size);

                // Get all registrations for display
                const registrationsList = registrationsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRegistrations(registrationsList);

                // Check if current user is registered
                const userRegistration = registrationsSnapshot.docs.find(
                    doc => doc.data().email === userProfile?.email
                );
                setIsRegistered(!!userRegistration);
                if (userRegistration) {
                    setRegistrationId(userRegistration.id);
                }

                // Check if user has given feedback for past events
                if (!isUpcoming && isRegistered) {
                    const feedbackQuery = query(
                        collection(db, 'event_feedback'),
                        where('event_id', '==', id),
                        where('user_email', '==', userProfile?.email)
                    );
                    const feedbackSnapshot = await getDocs(feedbackQuery);
                    setHasGivenFeedback(!feedbackSnapshot.empty);
                }
            } catch (err) {
                console.error('Error fetching registration data:', err);
            }
        };

        fetchRegistrationData();

        // Set up real-time listener for registration changes
        const registrationsRef = collection(db, 'registrations');
        const q = query(registrationsRef, where('event_id', '==', id));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setRegistrationCount(snapshot.size);
            
            // Update registrations list
            const registrationsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRegistrations(registrationsList);

            // Update user registration status
            const userRegistration = snapshot.docs.find(
                doc => doc.data().email === userProfile?.email
            );
            setIsRegistered(!!userRegistration);
            if (userRegistration) {
                setRegistrationId(userRegistration.id);
            } else {
                setRegistrationId(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [id, showDetails, userProfile?.email, isUpcoming]);

    const handleDetailsClick = (e) => {
        e.preventDefault();
        setShowDetails(!showDetails);
    };

    const handleDeleteRegistration = async () => {
        if (!window.confirm('Are you sure you want to cancel your registration?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'registrations', registrationId));
            setIsRegistered(false);
            setRegistrationId(null);
            setRegistrationCount(prev => prev - 1);
            setRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
        } catch (error) {
            console.error('Error deleting registration:', error);
        }
    };

    const handleOrganizerClick = (e) => {
        e.preventDefault();
        if (userProfile?.role === 'organizer' && organizerId === userProfile.organizing_group_id) {
            return;
        }
        navigate(`/organizer/${organizerName.toLowerCase().replace(/\s+/g, '-')}`);
    };

    return (
        <div className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white w-full max-w-[320px]">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-[#1D3557]">{title}</h3>
                {organizerName && (
                    <button
                        onClick={handleOrganizerClick}
                        className={`text-sm ${userProfile?.role === 'organizer' && organizerId === userProfile.organizing_group_id 
                            ? 'text-gray-400 cursor-default' 
                            : 'text-blue-600 hover:text-blue-800 hover:underline'}`}
                    >
                        {organizerName}
                    </button>
                )}
            </div>
            <p className="text-sm text-gray-600 mt-1">Date: {date}</p>

            {type && (
                <p className="text-sm text-gray-500 mt-1">Type: <span className="font-medium">{type}</span></p>
            )}

            <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">
                    Max Participants: <span className="font-medium">{participants}</span>
                </p>
                <p className="text-sm text-gray-500">
                    Registered: <span className="font-medium">{registrationCount}</span>
                </p>
            </div>

            <div className="flex gap-2 mt-3">
                {userProfile?.role === 'student' && (
                    <div className="flex gap-2">
                        {isRegistered && (
                            <>
                                <Link
                                    to={`/edit-registration/${registrationId}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Edit Registration
                                </Link>
                                {isUpcoming && (
                                    <button
                                        onClick={handleDeleteRegistration}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Cancel Registration
                                    </button>
                                )}
                                {!isUpcoming && !hasGivenFeedback && (
                                    <Link
                                        to={`/event-feedback/${id}`}
                                        className="text-purple-600 hover:text-purple-800 text-sm"
                                    >
                                        Give Feedback
                                    </Link>
                                )}
                            </>
                        )}
                        {!isRegistered && isUpcoming && (
                            <Link
                                to={`/${id}/register`}
                                className="text-sm underline text-[#1D3557] hover:text-[#457B9D]"
                            >
                                Register
                            </Link>
                        )}
                    </div>
                )}

                <button
                    onClick={handleDetailsClick}
                    className="text-sm underline text-[#1D3557] hover:text-[#457B9D]"
                >
                    {showDetails ? 'Hide Details' : 'Details'}
                </button>
            </div>

            {showDetails && (
                <div className="mt-4 pt-4 border-t">
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Description:</span> {description}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Venue:</span> {venue}
                        </p>
                        <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Registrations ({registrationCount}/{participants})</p>
                            <div className="max-h-40 overflow-y-auto">
                                {registrations.map(reg => (
                                    <div key={reg.id} className="text-sm text-gray-600 py-1 border-b last:border-b-0">
                                        <p className="font-medium">{reg.name}</p>
                                        <p className="text-xs text-gray-500">USN: {reg.usn} • Email: {reg.email}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardEventCard
