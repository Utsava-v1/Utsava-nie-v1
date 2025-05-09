import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const EditEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        venue: '',
        description: '',
        type: '',
        participants: '',
        image: null
    });

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const eventDoc = await getDoc(doc(db, 'events', eventId));
                if (!eventDoc.exists()) {
                    setError('Event not found');
                    return;
                }

                const eventData = eventDoc.data();
                setFormData({
                    name: eventData.name || '',
                    date: eventData.date?.toDate?.().toISOString().split('T')[0] || '',
                    time: eventData.time || '',
                    venue: eventData.venue || '',
                    description: eventData.description || '',
                    type: eventData.type || '',
                    participants: eventData.participants || '',
                    image: null
                });
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('Failed to fetch event details');
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const eventRef = doc(db, 'events', eventId);
            const updateData = {
                name: formData.name,
                date: new Date(formData.date),
                time: formData.time,
                venue: formData.venue,
                description: formData.description,
                type: formData.type,
                participants: parseInt(formData.participants) || 0
            };

            await updateDoc(eventRef, updateData);
            setSuccess('Event updated successfully!');
            
            // Navigate back to dashboard after 2 seconds
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        } catch (err) {
            console.error('Error updating event:', err);
            setError('Failed to update event');
        }
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-4 text-[#1D3557]">Edit Event</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                    <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                    <input
                        type="number"
                        name="participants"
                        value={formData.participants}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        accept="image/*"
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-[#1D3557] text-white py-2 rounded hover:bg-[#457B9D] transition"
                    >
                        Update Event
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

export default EditEvent; 