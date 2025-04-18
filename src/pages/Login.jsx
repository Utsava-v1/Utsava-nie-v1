import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/'); // Navigate to home page after successful login
        } catch (error) {
            setError('Failed to sign in: ' + error.message);
        }
        setLoading(false);
    }

    async function handleGoogleSignIn() {
        try {
            setError('');
            setLoading(true);
            await signInWithGoogle();
            navigate('/');
        } catch (error) {
            setError('Failed to sign in with Google: ' + error.message);
        }
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F1FAEE]">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-[#1D3557] mb-6 text-center">Welcome Back!</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-[#2F3E46] mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-400"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1D3557] text-white py-3 rounded-md hover:bg-[#E63946] transition-colors"
                    >
                        Log In
                    </button>
                </form>
                <p className="text-sm text-center text-[#2F3E46] mt-4">
                    Don't have an account? <Link to="/signup" className="text-[#E63946] hover:underline">Sign up</Link>
                </p>
                <div className="mt-6">
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
