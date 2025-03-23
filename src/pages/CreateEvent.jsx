import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CreateEvent = () => {
    const { organizerName } = useParams(); // Get organizerName from URL params

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        capacity: '',
        organizer: organizerName, // Set directly from the URL param
        registrationLink: '',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        // Set organizer name from URL param on load
        setFormData((prev) => ({ ...prev, organizer: organizerName }));
    }, [organizerName]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (
            !formData.title ||
            !formData.date ||
            !formData.location ||
            !formData.description ||
            !formData.capacity ||
            !formData.registrationLink
        ) {
            setError('All fields are required.');
            return false;
        }

        if (isNaN(formData.capacity) || formData.capacity <= 0) {
            setError('Capacity must be a positive number.');
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch('/api/events/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create event');
            alert('Event created successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold text-[#1D3557] mb-4">Create New Event</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Event Title"
                    className="w-full border p-2 rounded-md"
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md"
                    required
                />
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="w-full border p-2 rounded-md"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Event Description"
                    className="w-full border p-2 rounded-md h-24"
                    required
                />
                <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Capacity"
                    className="w-full border p-2 rounded-md"
                    required
                />
                <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    readOnly
                    className="w-full border p-2 rounded-md bg-gray-100"
                />
                <input
                    type="url"
                    name="registrationLink"
                    value={formData.registrationLink}
                    onChange={handleChange}
                    placeholder="Registration Link"
                    className="w-full border p-2 rounded-md"
                    required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="submit" className="w-full bg-[#1D3557] text-white py-2 rounded-md mt-2 hover:bg-[]">
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
