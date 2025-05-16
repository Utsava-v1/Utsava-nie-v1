import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { serverTimestamp } from 'firebase/firestore';

function CompleteProfile() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orgName: '',
    orgEmail: currentUser?.email || '',
    orgDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if not an organizer or profile already completed
  useEffect(() => {
    if (!currentUser || !userProfile) {
      navigate('/login');
      return;
    }
    if (userProfile.role !== 'organizer') {
      toast.error('Access restricted to organizers');
      navigate('/');
      return;
    }

    // Check if profile exists
    const checkProfile = async () => {
      const orgRef = doc(db, 'organizing_group', currentUser.uid);
      const orgSnap = await getDoc(orgRef);
      if (orgSnap.exists()) {
        navigate(`/${orgSnap.data().orgName}/dashboard`);
      }
    };
    checkProfile();
  }, [currentUser, userProfile, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.orgName.trim()) {
      newErrors.orgName = 'Organization name is required';
    } else if (formData.orgName.length < 3) {
      newErrors.orgName = 'Organization name must be at least 3 characters';
    }
    if (!formData.orgEmail.trim()) {
      newErrors.orgEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.orgEmail)) {
      newErrors.orgEmail = 'Invalid email format';
    }
    if (!formData.orgDescription.trim()) {
      newErrors.orgDescription = 'Description is required';
    } else if (formData.orgDescription.length < 10) {
      newErrors.orgDescription = 'Description must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    try {
      const orgRef = doc(db, 'organizing_group', currentUser.uid);
      await setDoc(orgRef, {
        orgName: formData.orgName.trim(),
        orgEmail: formData.orgEmail.trim(),
        orgDescription: formData.orgDescription.trim(),
        createdAt: serverTimestamp(),
      });
      toast.success('Profile completed successfully');
      navigate(`/${formData.orgName}/dashboard`);
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-[#1D3557]">
            Complete Your Organizer Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please provide your organization details
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <input
                id="orgName"
                name="orgName"
                type="text"
                value={formData.orgName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.orgName ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-[#1D3557] focus:border-[#1D3557] sm:text-sm`}
                placeholder="Enter organization name"
              />
              {errors.orgName && (
                <p className="mt-1 text-sm text-red-500">{errors.orgName}</p>
              )}
            </div>

            <div>
              <label htmlFor="orgEmail" className="block text-sm font-medium text-gray-700">
                Organization Email
              </label>
              <input
                id="orgEmail"
                name="orgEmail"
                type="email"
                value={formData.orgEmail}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.orgEmail ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-[#1D3557] focus:border-[#1D3557] sm:text-sm`}
                placeholder="Enter organization email"
              />
              {errors.orgEmail && (
                <p className="mt-1 text-sm text-red-500">{errors.orgEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor="orgDescription" className="block text-sm font-medium text-gray-700">
                Organization Description
              </label>
              <textarea
                id="orgDescription"
                name="orgDescription"
                value={formData.orgDescription}
                onChange={handleChange}
                rows="4"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.orgDescription ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-[#1D3557] focus:border-[#1D3557] sm:text-sm`}
                placeholder="Describe your organization"
              />
              {errors.orgDescription && (
                <p className="mt-1 text-sm text-red-500">{errors.orgDescription}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1D3557] hover:bg-[#E63946] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D3557] ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;