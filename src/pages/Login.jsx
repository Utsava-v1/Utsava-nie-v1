import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LiaJenkins } from 'react-icons/lia';

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
        <div className="h-full w-auto m-5 flex items-center justify-center">
            <div className="bg-white backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-lg">
                <div className='self-center justify-self-center'>

                    <h2 className="text-3xl font-bold text-[#1D3557] mb-5 text-center">You're Back!🤩</h2>
                    <div className="text-red-400 text-sm justify-self-center mb-5 animate-bounce ">Login to register for events.</div>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                placeholder='Email'
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                placeholder='Password'
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1D3557] text-white py-2 rounded-md hover:bg-[#1D3577] transition"
                        >
                            Login
                        </button>
                    </form>
                    <a
                        href="#"
                        className="block text-sm text-gray-600 mt-3 hover:!underline"
                    >
                        Forgot Password?
                    </a>
                    <div className="text-gray-500 text-sm justify-self-center">— or —</div>

                    <div className="mt-6">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition hover:cursor-pointer"
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google Icon"
                                className="w-5 h-5"
                            />
                            <span className="text-sm text-gray-700">Login with Google</span>
                        </button>
                    </div>
                    <div className="mt-6 text-sm text-gray-500 justify-self-center">— New here? Sign up —</div>

                    <div className="flex gap-3 mt-4 flex-wrap justify-center">
                        <Link
                            to="/student-signup"
                            className="flex-1 text-center bg-[#1D3557] text-white py-2 rounded-md hover:bg-[#1D3577] transition min-w-[140px]"
                        >
                            👨‍🎓 Student
                        </Link>
                        <Link
                            to="/organizer-signup"
                            className="flex-1 bg-[#E63946] text-white text-center py-2 rounded-md hover:bg-[#e63937] transition min-w-[140px]"
                        >
                            📋 Organizer
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
