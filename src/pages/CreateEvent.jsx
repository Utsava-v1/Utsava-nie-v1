import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const CreateEvent = () => {
    const { organizerName } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        venue: '',
        image: null,
        description: '',
        type: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [organizerRef, setOrganizerRef] = useState(null);

    useEffect(() => {
        const fetchOrganizerRef = async () => {
            const nameFromParam = organizerName.replace(/-/g, ' ').toLowerCase();

            const q = query(collection(db, 'organizing_group'));

            const snap = await getDocs(q);
            const matchingDoc = snap.docs.find(doc =>
                doc.data().name.toLowerCase() === nameFromParam
            );

            if (matchingDoc) {
                setOrganizerRef(matchingDoc.ref);
            } else {
                setError('Organizer not found');
            }
        };

        fetchOrganizerRef();
    }, [organizerName]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.date || !formData.time || !formData.venue) {
            setError('Please fill all fields');
            return;
        }

        if (!organizerRef) {
            setError('Organizer reference not found');
            return;
        }

        try {
            await addDoc(collection(db, 'events'), {
                name: formData.name,
                date: Timestamp.fromDate(new Date(formData.date)),
                time: formData.time,
                venue: formData.venue,
                image_name: formData.image ? formData.image.name : null,
                organizing_group_id: organizerRef,
            });

            setSuccess('Event created successfully!');
            setFormData({ name: '', date: '', time: '', venue: '', image: null, description: '', type: '' });
        } catch (err) {
            console.error(err);
            setError('Failed to create event');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold mb-4 text-[#1D3557]">
                {organizerName} - Create New Event
            </h2> 
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Event Name" className="w-full p-2 border rounded" required />

                <input type="date" name="date" value={formData.date} onChange={handleChange}
                    className="w-full p-2 border rounded" required />

                <input type="time" name="time" value={formData.time} onChange={handleChange}
                    className="w-full p-2 border rounded" required />

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
                        rows="4"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1D3557] focus:border-transparent"
                        placeholder="Enter event description..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <input type="file" name="image" onChange={handleChange}
                    className="w-full p-2 border rounded" accept="image/*" />

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <button type="submit" className="w-full bg-[#1D3557] text-white py-2 rounded hover:bg-[#457B9D]">
                    Create Event
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
