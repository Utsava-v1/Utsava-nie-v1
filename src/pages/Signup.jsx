import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    password: '',
    semester: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password, name, usn, semester, phone } = formData;

      // Input validation
      if (!email || !password || !name || !usn || !semester || !phone) {
        toast.error('Please fill all fields 📝');
        setLoading(false);
        return;
      }

      // Create user
      const userCredential = await signup(email, password, 'student');

      // Create student profile in Firestore
      await setDoc(doc(db, 'students', userCredential.user.uid), {
        usn,
        email,
        name,
        semester,
        role: 'student',
        phone,
        events: [],
        events_registered: [], // Initialize empty array for registered event names
      });

      toast.success('Signed up successfully! 🎉');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please use a different email 😔');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters long 🔐');
      } else {
        toast.error('Failed to sign up. Please try again 😔');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Prompt for additional student details
      const name = prompt('Enter your full name:');
      const usn = prompt('Enter your USN:');
      const semester = prompt('Enter your semester (e.g., 5th Semester):');
      const phone = prompt('Enter your phone number:');

      if (!name || !usn || !semester || !phone) {
        toast.error('All fields are required for Google sign-in 📝');
        await user.delete();
        return;
      }

      // Create student profile
      await setDoc(doc(db, 'students', user.uid), {
        usn,
        email: user.email,
        name,
        semester,
        role: 'student',
        phone,
        events: [],
        events_registered: [], // Initialize empty array for registered event names
      });

      toast.success('Signed up with Google successfully! 🎉');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign up with Google. Please try again 😔');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
        <h2 className="text-3xl font-extrabold text-[#1D3557] mb-6 text-center">
          Student Signup 🚀
        </h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Password 🔐</label>
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              value={formData.password}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone 📱</label>
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D3557] focus:border-transparent transition-colors duration-200"
              required
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
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-full hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <img src="/images/google-logo.png" alt="Google" className="w-5 h-5" />
            Sign Up with Google 🌐
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-[#1D3557] hover:underline">
            Log in here 🔗
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;