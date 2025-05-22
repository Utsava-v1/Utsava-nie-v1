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
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        } catch (err) {
            console.error('Error updating event:', err);
            setError('Failed to update event');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-100">
            <div className="text-gray-600 text-lg animate-pulse">Loading Event... ⏳</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-100">
            <div className="text-red-600 text-lg">{error}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-3xl font-extrabold text-[#1D3557] mb-6 text-center">Edit Event ✏️</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {[
                        { label: 'Event Name', name: 'name', type: 'text' },
                        { label: 'Date', name: 'date', type: 'date' },
                        { label: 'Time', name: 'time', type: 'time' },
                        { label: 'Venue', name: 'venue', type: 'text' },
                        { label: 'Event Type', name: 'type', type: 'text' },
                        { label: 'Max Participants', name: 'participants', type: 'number' },
                    ].map(({ label, name, type }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition"
                                required
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition"
                            accept="image/*"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-600 text-sm text-center">{success}</p>}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-[#1D3557] to-[#457B9D] text-white py-2 rounded-full hover:opacity-90 transition-all shadow-md"
                        >
                            Update Event
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-gray-400 text-white py-2 rounded-full hover:bg-gray-500 transition-all shadow-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;
