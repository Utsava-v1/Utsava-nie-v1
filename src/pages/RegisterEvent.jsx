import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function RegisterEvent() {
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    semester: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, 'events', event_id));
        if (eventDoc.exists()) {
          setEvent(eventDoc.data());
        } else {
          console.error('Event not found');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [event_id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const registration_id = `${event_id}_${formData.usn}`;
      const registrationData = {
        registration_id,
        event_id,
        name: formData.name,
        usn: formData.usn,
        email: formData.email,
        semester: formData.semester,
        timestamp: serverTimestamp(),
      };

      await setDoc(doc(db, 'registrations', registration_id), registrationData);

      alert('Registered successfully!');
      setFormData({ name: '', usn: '', email: '', semester: '' });
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 sm:px-12">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-[#1D3557] mb-4 text-center">
          Register for {event ? event.name : '...'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1D3557]"
            required
          />
          <input
            type="text"
            name="usn"
            placeholder="USN"
            value={formData.usn}
            onChange={handleChange}
            className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1D3557]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1D3557]"
            required
          />
          <input
            type="text"
            name="semester"
            placeholder="Semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full border rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1D3557]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#1D3557] text-white py-3 rounded hover:bg-[#E63946] transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterEvent;
