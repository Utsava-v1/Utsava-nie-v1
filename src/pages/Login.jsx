import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login Data:', formData);
        // Handle login logic here
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F1FAEE]">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-[#1D3557] mb-6 text-center">Welcome Back!</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-[#2F3E46] mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-[#2F3E46] mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#1D3557] text-white py-3 rounded-md hover:bg-[#E63946] transition-colors"
                    >
                        Log In
                    </button>
                </form>
                <p className="text-sm text-center text-[#2F3E46] mt-4">
                    Don't have an account? <Link to="/signup" className="text-[#E63946] hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
