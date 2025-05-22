import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUserProfile } from '../utils/firestore';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    password: '',
    semester: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { email, password, name, usn, semester, phone } = formData;

      // Input validation
      if (!email || !password || !name || !usn || !semester || !phone) {
        setError('Please fill all fields');
        toast.error('Please fill all fields 📝');
        setLoading(false);
        return;
      }

      // Create user
      console.log('Creating auth user:', { email, role: 'student' });
      const userCredential = await signup(email, password, 'student');
      const user = userCredential.user;

      try {
        // Create user profile in /users/<uid>
        console.log('Creating user profile in /users:', { uid: user.uid, email, usn, name });
        await createUserProfile(user.uid, {
          email: user.email,
          usn,
          name,
          role: 'student',
        });

        // Create student profile in /students/<uid>
        console.log('Creating student profile in /students:', { uid: user.uid, usn, email, name, semester, phone });
        await setDoc(doc(db, 'students', user.uid), {
          usn,
          email: user.email,
          name,
          semester,
          role: 'student',
          phone,
          events: [],
          events_registered: [],
          registrations: [],
        });
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError.message);
        // Delete auth user to maintain consistency
        console.log('Rolling back: Deleting auth user:', user.uid);
        await user.delete();
        setError('Failed to create profile: ' + firestoreError.message);
        toast.error('Failed to create profile: ' + firestoreError.message);
        setLoading(false);
        return;
      }

      console.log('Signup successful for user:', user.uid);
      toast.success('Signed up successfully! 🎉');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Signup error:', error.message);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use');
        toast.error('Email already in use. Please use a different email 😔');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long');
        toast.error('Password should be at least 6 characters long 🔐');
      } else if (error.code === 'permission-denied') {
        setError('Permission denied: Unable to create profile');
        toast.error('Permission denied: Unable to create profile 😔');
      } else {
        setError('Failed to sign up: ' + error.message);
        toast.error('Failed to sign up: ' + error.message + ' 😔');
      }
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-auto m-5 flex items-center justify-center">
      <div className="bg-white backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-[#1D3557] mb-5 text-center">
          Welcome, Student! 🚀
        </h2>
        <div className="text-red-400 text-sm justify-self-center mb-5 animate-bounce">
          Sign up to join campus events.
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-5" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="usn"
              placeholder="USN"
              value={formData.usn}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="semester"
              placeholder="Semester (e.g., 5th Semester)"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D3557] text-white py-2 rounded-md hover:bg-[#1D3577] transition"
          >
            {loading ? 'Signing Up... ⏳' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-sm text-gray-500 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1D3557] hover:underline">
            Log in here
          </Link>
        </div>
        <div className="mt-4 text-sm text-gray-500 text-center">
          — or —
        </div>
        <div className="flex gap-3 mt-4 flex-wrap justify-center">
          <Link
            to="/organizer-signup"
            className="flex-1 bg-[#E63946] text-white text-center py-2 rounded-md hover:bg-[#e63937] transition min-w-[140px]"
          >
            📋 Sign up as Organizer
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;