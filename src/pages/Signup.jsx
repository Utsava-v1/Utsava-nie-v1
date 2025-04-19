import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    }
    setLoading(false);
  }

  const { login, signInWithGoogle } = useAuth();

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
          <h2 className="text-3xl font-bold text-[#1D3557] mb-5 text-center">Welcome Onboard!😎</h2>
          <div className="text-gray-500 text-sm justify-self-center mb-5">Join us in the ocean of events.</div>


          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
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
            <div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                placeholder='Confirm password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1D3557] text-white py-2 rounded-md hover:bg-[#1D3577] transition"
            >
              Sign Up
            </button>
          </form>
          <div className="text-gray-500 m-2 text-sm justify-self-center">— or —</div>
          <div className="">
            <button
              onClick={handleGoogleSignIn }
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition hover:cursor-pointer"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Icon"
                className="w-5 h-5"
              />
              <span className="text-sm text-gray-700">Signup with Google</span>
            </button>
          </div>
          {/* <p className="text-sm text-center text-[#2F3E46] mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[#E63946] hover:underline">Log in</Link>
          </p> */}
          <div className="flex gap-5 mt-4 flex-wrap justify-evenly">
            <div className='grid justify-center'>
              <div className="text-gray-500 m-2 text-sm justify-self-center"> Already Registered? </div>
              <Link
                to="/login"
                className="flex-1 text-center bg-[#E63946] text-white py-2 rounded-md hover:bg-[#e63937] transition min-w-[140px]"
              >
                🚀 Login
              </Link>
            </div>
            <div className='grid justify-center'>
              <div className="text-gray-500 m-2 text-sm justify-self-center"> Not a Student? </div>
              <Link
                to="/organizer-signup"
                className="flex-1 text-center bg-[#E63946] text-white py-2 rounded-md hover:bg-[#e63937] transition min-w-[140px]"
              >
                📋 Organizer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
