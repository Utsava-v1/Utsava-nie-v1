import React, { useState } from 'react';

const Student = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        usn: ''
    });
    const [error, setError] = useState('');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFormData({
            name: '',
            email: '',
            password: '',
            usn: ''
        });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Email and Password are required');
            return false;
        }
        if (activeTab === 'signup') {
            if (!formData.name || !formData.usn) {
                setError('All fields are required');
                return false;
            }
            if (!/^\d{10}$/.test(formData.usn)) {
                setError('Invalid USN format');
                return false;
            }
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (activeTab === 'login') {
                const response = await fetch('/api/student/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password })
                });
                if (!response.ok) throw new Error('Login failed');
                alert('Login successful');
            } else {
                const response = await fetch('/api/student/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) throw new Error('Signup failed');
                alert('Signup successful');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-center text-[#1D3557] mb-4">
                Student Portal
            </h2>

            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button
                    className={`flex-1 p-3 text-center ${
                        activeTab === 'login' ? 'border-b-2 border-[#1D3557] font-semibold' : 'text-gray-500'
                    }`}
                    onClick={() => handleTabChange('login')}
                >
                    Login
                </button>
                <button
                    className={`flex-1 p-3 text-center ${
                        activeTab === 'signup' ? 'border-b-2 border-[#1D3557] font-semibold' : 'text-gray-500'
                    }`}
                    onClick={() => handleTabChange('signup')}
                >
                    Signup
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'signup' && (
                    <>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-[#457B9D]"
                            required
                        />
                        <input
                            type="text"
                            name="usn"
                            value={formData.usn}
                            onChange={handleChange}
                            placeholder="USN"
                            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-[#457B9D]"
                            required
                        />
                    </>
                )}

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-[#457B9D]"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:border-[#457B9D]"
                    required
                />

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-[#1D3557] text-white py-2 rounded-md hover:bg-[#457B9D] transition"
                >
                    {activeTab === 'login' ? 'Login' : 'Signup'}
                </button>
            </form>
        </div>
    );
};

export default Student;
