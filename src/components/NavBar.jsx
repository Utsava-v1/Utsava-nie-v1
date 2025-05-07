import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase';

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [role, setRole] = useState(null);
  const [organizerName, setOrganizerName] = useState('');
  const [studentUsn, setStudentUsn] = useState('');
  const [loadingRole, setLoadingRole] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = () => {
    if (loadingRole) return;

    if (role === 'student') navigate(`/${studentUsn}/profile`);
    else if (role === 'organizer') navigate(`/${organizerName}/dashboard`);
    else alert("Role not recognized");
  };

  useEffect(() => {
    const fetchRole = async () => {
      if (!currentUser?.email) {
        setLoadingRole(false);
        return;
      }

      try {
        const studentQuery = query(collection(db, 'students'), where('email', '==', currentUser.email));
        const organizerQuery = query(collection(db, 'organizing_group'), where('email', '==', currentUser.email));

        const [studentSnap, organizerSnap] = await Promise.all([
          getDocs(studentQuery),
          getDocs(organizerQuery),
        ]);

        if (!studentSnap.empty) {
          const studentData = studentSnap.docs[0].data();
          setRole('student');
          setStudentUsn(studentData.usn);
        } else if (!organizerSnap.empty) {
          const organizerData = organizerSnap.docs[0].data();
          setRole('organizer');
          setOrganizerName(organizerData.name);
        }
      } catch (err) {
        console.error("Error fetching role:", err);
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, [currentUser]);

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
            <span
              onClick={handleProfileClick}
              className={`cursor-pointer text-lg transition ${loadingRole ? 'opacity-50 pointer-events-none' : 'hover:text-[#E63946]'}`}
              title={loadingRole ? "Loading role..." : "Go to dashboard"}
            >
              {showUserDetails
                ? `${currentUser.displayName || currentUser.email}`
                : `${(currentUser.displayName || currentUser.email).slice(0, 7)}...`}
            </span>

            <button onClick={handleLogout} className="text-white text-lg p-3 py-1 rounded-sm bg-[#E63946] hover:bg-[#F63956]">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
