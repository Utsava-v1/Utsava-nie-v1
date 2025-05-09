import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ManageEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);

    useEffect(() => {
        const fetchEventAndRegistrations = async () => {
            try {
                // Fetch event details
                const eventDoc = await getDoc(doc(db, 'events', eventId));
                if (!eventDoc.exists()) {
                    setError('Event not found');
                    return;
                }
                setEvent({ id: eventDoc.id, ...eventDoc.data() });

                // Fetch registrations
                const registrationsQuery = query(
                    collection(db, 'registrations'),
                    where('event_id', '==', eventId)
                );
                const registrationsSnap = await getDocs(registrationsQuery);
                const registrationsData = registrationsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRegistrations(registrationsData);
                setFilteredRegistrations(registrationsData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch event data');
            } finally {
                setLoading(false);
            }
        };

        fetchEventAndRegistrations();
    }, [eventId]);

    useEffect(() => {
        const filtered = registrations.filter(reg => 
            reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRegistrations(filtered);
    }, [searchTerm, registrations]);

    const handleDeleteRegistration = async (registrationId) => {
        if (!window.confirm('Are you sure you want to delete this registration?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'registrations', registrationId));
            setRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
            setFilteredRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
        } catch (err) {
            console.error('Error deleting registration:', err);
            setError('Failed to delete registration');
        }
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!event) return <div className="text-center mt-8">Event not found</div>;

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6">
            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-3xl font-semibold text-[#1D3557] mb-4">{event.name}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600"><strong>Date:</strong> {event.date?.toDate?.().toLocaleDateString()}</p>
                        <p className="text-gray-600"><strong>Time:</strong> {event.time}</p>
                        <p className="text-gray-600"><strong>Venue:</strong> {event.venue}</p>
                    </div>
                    <div>
                        <p className="text-gray-600"><strong>Type:</strong> {event.type}</p>
                        <p className="text-gray-600"><strong>Max Participants:</strong> {event.participants}</p>
                        <p className="text-gray-600"><strong>Current Registrations:</strong> {registrations.length}</p>
                    </div>
                </div>
            </div>

            {/* Registrations Management */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-[#1D3557]">Registrations</h3>
                    <input
                        type="text"
                        placeholder="Search registrations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded w-64 focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                    />
                </div>

                {filteredRegistrations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">USN</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Semester</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{reg.name}</td>
                                        <td className="px-4 py-2">{reg.usn}</td>
                                        <td className="px-4 py-2">{reg.email}</td>
                                        <td className="px-4 py-2">{reg.semester}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleDeleteRegistration(reg.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-4">
                        {searchTerm ? 'No matching registrations found' : 'No registrations yet'}
                    </p>
                )}
            </div>

            {/* Back Button */}
            <div className="mt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ManageEvent; 