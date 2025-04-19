import { React, useRef, userEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const [showUserDetails, setShowUserDetails] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleUserInfo = () => {
    setShowUserDetails(prev => !prev);
  }

  return (
    <nav className="bg-[#1D3557] flex justify-between items-center !p-2 !pl-5 !pr-5">
      <Link to='/' className="logo flex items-center justify-center gap-3">
        <img src="/images/logo.jpg" alt="Logo" className="h-10 rounded-full" />
        <h1 className='font-code !text-white'>NIE Utsava</h1>
      </Link>

      <div className='flex flex-wrap gap-15 items-center'>
        <div className='flex gap-10'>
          <Link to="/" className="!text-white text-lg  p-3 py-2 hover:!text-[#E63946]">Home</Link>
          <Link to="/about" className="!text-white text-lg  p-3 py-2 hover:!text-[#E63946]">About</Link>
          <Link to="/feedback" className="!text-white text-lg  p-3 py-2 hover:!text-[#E63946]">Feedback</Link>
        </div>

        {!currentUser ? (
          <div className='flex gap-10'>
            <Link to="/login" className="!text-white text-lg p-3 py-1 rounded-sm bg-[#E63946] hover:bg-[#F63956]">Login</Link>
            <Link to="/student-signup" className="!text-white text-lg p-3 py-1 rounded-sm bg-[#E63946] hover:bg-[#F63956]">Signup</Link>
          </div>
        ) : (
          <div className='flex items-center gap-5 text-white'>
            {/* for identifing student and organizer */}
            <span
              onClick={toggleUserInfo}
              className="cursor-pointer text-lg hover:text-[#E63946] transition"
            >
              {showUserDetails
                ? <>

                  {currentUser.displayName || currentUser.name} {currentUser.email}
                </>
                : `${currentUser.displayName || currentUser.email}`.slice(0, 7) + "..."}
            </span>

            <button onClick={handleLogout} className="text-white text-lg p-3 py-1 rounded-sm bg-[#E63946] hover:bg-[#F63956]">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
