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
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
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
      toast.error('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const userCredential = await signup(formData.email, formData.password);
      const user = userCredential.user;

      // Save to users collection
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        role: 'organizer', // Default role
        createdAt: serverTimestamp(),
      });

      // Save to organizing_group collection using uid
      await setDoc(doc(db, 'organizing_group', user.uid), {
        name: formData.name,
        email: formData.email,
        desc: formData.field,
        createdAt: serverTimestamp(),
      });

      toast.success('Account created successfully');
      navigate(`/${formData.name}/dashboard`);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create an account: ' + err.message);
      toast.error('Failed to create an account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-auto border p-5 flex items-center justify-center">
      <div className="bg-white backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-[#1D3557] mb-3 text-center">
          Welcome Onboard! 😎
        </h2>
        <p className="text-gray-500 text-sm text-center mb-5">
          Let's get you set up to explore campus events.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Organization Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="email"
            name="email"
            placeholder="Organization Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="text"
            name="field"
            placeholder="Field (e.g., ML Club, Cybersecurity, Annual Fest)"
            value={formData.field}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D3557] text-white py-2 rounded-md hover:bg-[#1D3577] transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupOrg;