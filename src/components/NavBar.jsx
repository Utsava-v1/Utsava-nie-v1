import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

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
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const handleProfileClick = () => {
    if (loadingRole) return;

    if (role === 'student') {
      if (!studentUsn) {
        console.warn('Student USN is undefined');
        toast.error('Profile incomplete. Please update your USN.');
        navigate('/complete-profile');
        return;
      }
      navigate(`/${studentUsn}/profile`);
    } else if (role === 'organizer') {
      if (!organizerName) {
        console.warn('Organizer name is undefined');
        toast.error('Profile incomplete. Please update your organization details.');
        navigate('/complete-profile');
        return;
      }
      navigate(`/${organizerName.toLowerCase().replace(/\s+/g, '-')}/dashboard`);
    } else {
      console.warn('Role not recognized:', role);
      toast.error('Role not recognized. Please contact support.');
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      if (!currentUser) {
        console.log('No current user:', currentUser);
        setLoadingRole(false);
        return;
      }

      try {
        // console.log('Fetching role for UID:', currentUser.uid);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // console.log('User data:', userData);

          if (!userData.role) {
            console.warn('No role defined for user:', currentUser.uid);
            setLoadingRole(false);
            return;
          }

          setRole(userData.role);
          if (userData.role === 'student') {
            if (!userData.usn) {
              console.warn('Missing USN for student:', currentUser.uid);
            }
            setStudentUsn(userData.usn || '');
          } else if (userData.role === 'organizer') {
            const orgDoc = await getDoc(doc(db, 'organizing_group', currentUser.uid));
            if (orgDoc.exists()) {
              const orgData = orgDoc.data();
              const orgName = orgData.orgName || orgData.name || '';
              if (!orgName) {
                console.warn('Missing orgName/name for organizer:', currentUser.uid);
              }
              setOrganizerName(orgName);
            } else {
              console.warn('No organizing_group document found for UID:', currentUser.uid);
              setOrganizerName('');
            }
          }
        } else {
          console.warn('No user profile found for UID:', currentUser.uid);
        }
      } catch (err) {
        console.error('Error fetching role:', err);
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setLoadingRole(false);
      }
    };

    fetchRole();
  }, [currentUser]);

  return (
    <nav className="bg-[#1D3557] flex justify-between items-center !p-2 !pl-5 !pr-5">
      <Link to="/" className="logo flex items-center justify-center gap-3">
        <img src="/images/logo.jpg" alt="Logo" className="h-10 rounded-full" />
        <h1 className="font-code !text-white">NIE Utsava</h1>
      </Link>

      <div className="flex flex-wrap gap-15 items-center">
        <div className="flex gap-10">
          <Link to="/" className="!text-white text-lg p-3 py-2 hover:!text-[#E63946]">
            Home
          </Link>
          <Link to="/about" className="!text-white text-lg p-3 py-2 hover:!text-[#E63946]">
            About
          </Link>
          <Link to="/feedback" className="!text-white text-lg p-3 py-2 hover:!text-[#E63946]">
            Feedback
          </Link>
        </div>

        {!currentUser ? (
          <div className="flex gap-10">
            <Link
              to="/login"
              className="!text-white text-lg p-3 py-1 rounded-sm bg-[#E63946] hover:bg-[#F63956]"
            >
              Login
            </Link>
            <Link
              to="/student-signup"
              className="!text-white text-lg p-3 py-1 rounded-sm bg-[#E63946] hover:bg-[#F63956]"
            >
              Signup
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-5 text-white">
            <span
              onClick={handleProfileClick}
              className={`cursor-pointer text-lg transition ${
                loadingRole ? 'opacity-50 pointer-events-none' : 'hover:text-[#E63946]'
              }`}
              title={loadingRole ? 'Loading role...' : 'Go to dashboard'}
            >
              {showUserDetails
                ? currentUser.displayName || currentUser.email
                : `${(currentUser.displayName || currentUser.email).slice(0, 7)}...`}
            </span>

            <button
              onClick={handleLogout}
              className="text-white text-lg p-3 py-1 rounded-sm bg-[#E63946] hover:bg-[#F63956]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;