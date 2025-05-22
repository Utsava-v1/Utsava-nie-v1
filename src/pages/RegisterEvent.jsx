import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function RegisterEvent() {
  const { event_id } = useParams();
  const { currentUser, userProfile, profileLoading } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: currentUser?.email || '',
    semester: '',
  });
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    console.log('RegisterEvent loaded:', { 
      eventId: event_id, 
      user: currentUser?.uid, 
      email: currentUser?.email, 
      profileLoading, 
      userProfile 
    });

    if (!currentUser) {
      console.log('No user logged in, redirecting to /login');
      toast.error('Please log in to register for events 😔');
      navigate('/login');
      return;
    }

    if (profileLoading) {
      console.log('Waiting for user profile to load');
      return;
    }

    if (!userProfile || userProfile.role !== 'student') {
      alert('Only Students are allowed to regiseter!');
      toast.error('Only students can register for events 🚫');
      navigate('/');
      return;
    }

    const fetchEvent = async () => {
      try {
        // Fetch event
        const eventDoc = await getDoc(doc(db, 'events', event_id));
        if (!eventDoc.exists()) {
          console.error('Event not found:', event_id);
          toast.error('Event not found 😕');
          navigate('/404');
          return;
        }

        const eventData = eventDoc.data();
        const eventDate = eventData.date?.toDate?.() || new Date(eventData.date);
        if (eventDate < new Date()) {
          console.log('Event is in the past:', event_id);
          toast.error('Registration closed for past events.');
          navigate('/');
          return;
        }

        setEvent({ id: eventDoc.id, ...eventData });

        // Check existing registration
        const registration_id = `${event_id}_${formData.usn || currentUser.uid}`;
        const regDoc = await getDoc(doc(db, 'registrations', registration_id));
        if (regDoc.exists()) {
          console.log('User already registered:', registration_id);
          setIsRegistered(true);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details 😔');
        navigate('/');
      }
    };

    fetchEvent();
  }, [event_id, currentUser, userProfile, profileLoading, navigate, formData.usn]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.usn || !formData.email || !formData.semester) {
      toast.error('Please fill all fields 📝');
      return;
    }

    if (isRegistered) {
      toast.info('You are already registered for this event.');
      return;
    }

    try {
      setLoading(true);

      // Create registration document
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

      // Increment event registrations count
      const eventRef = doc(db, 'events', event_id);
      await updateDoc(eventRef, {
        registrations: increment(1),
      });

      // Update student's events_registered with event name
      const studentRef = doc(db, 'students', currentUser.uid);
      const studentDoc = await getDoc(studentRef);
      if (studentDoc.exists()) {
        const currentEvents = studentDoc.data().events_registered || [];
        if (!currentEvents.includes(event.name)) {
          await updateDoc(studentRef, {
            events_registered: arrayUnion(event.name),
          });
        }
      }

      toast.success('Registered successfully! 🎉');
      setFormData({ name: '', usn: '', email: currentUser.email, semester: '' });
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Failed to register: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-100">
        <div className="text-gray-600 text-lg animate-pulse">Loading Event... ⏳</div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-6 text-center">
          Register for {event.name} 🎉
        </h2>
        {isRegistered ? (
          <p className="text-green-600 text-center mb-6">You are already registered for this event.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name 👤</label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">USN 🎓</label>
              <input
                type="text"
                name="usn"
                placeholder="Your USN"
                value={formData.usn}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email 📧</label>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester 📚</label>
              <input
                type="text"
                name="semester"
                placeholder="e.g., 5th Semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#E63946] to-[#F63956] text-white py-3 rounded-full hover:from-[#F63956] hover:to-[#E63946] transition-all duration-300 shadow-md"
            >
              Register Now 🚀
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterEvent;