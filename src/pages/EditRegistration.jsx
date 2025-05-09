import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const EditRegistration = () => {
    const { registrationId } = useParams();
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        usn: '',
        email: '',
        semester: '',
        contact_no: ''
    });

    useEffect(() => {
        const fetchRegistrationData = async () => {
            try {
                // Get registration document
                const registrationDoc = await getDoc(doc(db, 'registrations', registrationId));
                if (!registrationDoc.exists()) {
                    setError('Registration not found');
                    return;
                }

                const registrationData = registrationDoc.data();

                // Verify that the current user owns this registration
                if (registrationData.email !== userProfile?.email) {
                    setError('You are not authorized to edit this registration');
                    return;
                }

                // Get event details
                const eventDoc = await getDoc(doc(db, 'events', registrationData.event_id));
                if (!eventDoc.exists()) {
                    setError('Event not found');
                    return;
                }

                setEvent(eventDoc.data());
                setFormData({
                    name: registrationData.name || '',
                    usn: registrationData.usn || '',
                    email: registrationData.email || '',
                    semester: registrationData.semester || '',
                    contact_no: registrationData.contact_no || ''
                });
            } catch (err) {
                console.error('Error fetching registration:', err);
                setError('Failed to fetch registration details');
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrationData();
    }, [registrationId, userProfile?.email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const registrationRef = doc(db, 'registrations', registrationId);
            await updateDoc(registrationRef, {
                name: formData.name,
                usn: formData.usn,
                semester: formData.semester,
                contact_no: formData.contact_no
            });

            setSuccess('Registration updated successfully!');
            
            // Navigate back after 2 seconds
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        } catch (err) {
            console.error('Error updating registration:', err);
            setError('Failed to update registration');
        }
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!event) return <div className="text-center mt-8">Event not found</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-4 text-[#1D3557]">Edit Registration</h2>
            <p className="text-gray-600 mb-6">Event: {event.name}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">USN</label>
                    <input
                        type="text"
                        name="usn"
                        value={formData.usn}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full p-2 border rounded bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <input
                        type="number"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        min="1"
                        max="8"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                        type="tel"
                        name="contact_no"
                        value={formData.contact_no}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        required
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-[#1D3557] text-white py-2 rounded hover:bg-[#457B9D] transition"
                    >
                        Update Registration
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRegistration; 