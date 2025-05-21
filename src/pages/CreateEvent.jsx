import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const CreateEvent = () => {
  const { currentUser } = useAuth();
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
  const [organizerName, setOrganizerName] = useState('');

  useEffect(() => {
    const fetchOrganizerRef = async () => {
      if (!currentUser?.email) return;

      const q = query(
        collection(db, 'organizing_group'),
        where('email', '==', currentUser.email)
      );
      const snap = await getDocs(q);

      if (snap.docs.length > 0) {
        setOrganizerRef(currentUser.uid);
        setOrganizerName(currentUser.displayName);
      } else {
        setError('Organizer not found for your account.');
      }
    };

    fetchOrganizerRef();
  }, [currentUser]);

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
        description: formData.description,
        type: formData.type,
        organizing_group_id: organizerRef,
        registrations: 0,
      });

      setSuccess('Event created successfully! ✅');
      setFormData({
        name: '',
        date: '',
        time: '',
        venue: '',
        image: null,
        description: '',
        type: '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to create event 😔');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-6 text-center">
          {organizerName ? `${organizerName} - Create Event 🎉` : 'Create New Event 🎉'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Tech Fest 2025"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date 📅</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time ⏰</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue 📍</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g., Main Auditorium"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description ✍️</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your event..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type 🎭</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
              required
            >
              <option value="" disabled>Select event type</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Fest">Fest</option>
              <option value="Club Event">Club Event</option>
              <option value="Competition">Competition</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#E63946] to-[#F63956] text-white py-3 rounded-full hover:from-[#F63956] hover:to-[#E63946] transition-all duration-300 shadow-md"
          >
            Create Event 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;