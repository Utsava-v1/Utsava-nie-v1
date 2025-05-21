import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupOrg = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    field: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match 🔐');
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.field) {
      setError('Please fill all required fields');
      toast.error('Please fill all required fields 📝');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Create user
      const userCredential = await signup(formData.email, formData.password, 'organizer');
      const user = userCredential.user;

      // Save to users collection
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        role: 'organizer',
        createdAt: serverTimestamp(),
      });

      // Save to organizing_group collection
      await setDoc(doc(db, 'organizing_group', user.uid), {
        name: formData.name,
        email: formData.email,
        desc: formData.field,
        phone: formData.phone || null,
        role: 'organizer',
        events_organized: [],
        createdAt: serverTimestamp(),
      });

      toast.success('Account created successfully! 🎉');
      navigate(`/${formData.name}/dashboard`);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
        toast.error('Email already in use. Please use a different email 😔');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long');
        toast.error('Password should be at least 6 characters long 🔐');
      } else {
        setError('Failed to create an account: ' + err.message);
        toast.error('Failed to create an account: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if organizer profile already exists
      const orgDoc = await getDoc(doc(db, 'organizing_group', user.uid));
      if (orgDoc.exists()) {
        toast.success('Welcome back! 🎉');
        navigate(`/${orgDoc.data().name}/dashboard`);
        return;
      }

      // Prompt for additional organizer details
      const name = prompt('Enter your organization name:');
      const field = prompt('Enter your field (e.g., ML Club, Cybersecurity, Annual Fest):');
      const phone = prompt('Enter your phone number (optional):');

      if (!name || !field) {
        toast.error('Organization name and field are required 📝');
        await user.delete();
        return;
      }

      // Save to users collection
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: user.email,
        role: 'organizer',
        createdAt: serverTimestamp(),
      });

      // Save to organizing_group collection
      await setDoc(doc(db, 'organizing_group', user.uid), {
        name,
        email: user.email,
        desc: field,
        phone: phone || null,
        role: 'organizer',
        events_organized: [],
        createdAt: serverTimestamp(),
      });

      toast.success('Signed up with Google successfully! 🎉');
      navigate(`/${name}/dashboard`);
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign up with Google: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-6 text-center">
          Organizer Signup 🚀
        </h2>
        <p className="text-gray-500 text-sm text-center mb-5">
          Let's get you set up to organize campus events.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name 👥</label>
            <input
              type="text"
              name="name"
              placeholder="Your Organization Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email 📧</label>
            <input
              type="email"
              name="email"
              placeholder="Your Organization Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password 🔐</label>
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password 🔐</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Your Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field 🎯</label>
            <input
              type="text"
              name="field"
              placeholder="e.g., ML Club, Cybersecurity, Annual Fest"
              value={formData.field}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone 📱 (Optional)</label>
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#E63946] to-[#F63956] text-white py-3 rounded-full hover:from-[#F63956] hover:to-[#E63946] transition-all duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? 'Signing Up... ⏳' : 'Sign Up 🚀'}
          </button>
        </form>
        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-full hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <img src="/images/google-logo.png" alt="Google" className="w-5 h-5" />
            Sign Up with Google 🌐
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#1D3557] hover:underline">
            Log in here 🔗
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupOrg;