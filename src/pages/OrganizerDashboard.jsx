import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const OrganizerDashboard = () => {
  const { orgName } = useParams(); // Expects /:orgName/dashboard
  const { currentUser } = useAuth();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizer = async () => {
      if (!currentUser) {
        toast.error('Please log in to access the dashboard');
        navigate('/login');
        return;
      }

      try {
        const orgDoc = await getDoc(doc(db, 'organizing_group', currentUser.uid));
        if (!orgDoc.exists()) {
          console.error(`No organizing_group document found for UID: ${currentUser.uid}`);
          toast.error('Organizer profile not found');
          navigate('/complete-profile');
          return;
        }

        const orgData = orgDoc.data();
        const storedOrgName = orgData.orgName || orgData.name || '';
        // Normalize for comparison (lowercase, replace spaces with hyphens)
        const normalizedStoredOrgName = storedOrgName.toLowerCase().replace(/\s+/g, '-');
        // const normalizedInputOrgName = orgName.toLowerCase().replace(/\s+/g, '-');

        // if (normalizedStoredOrgName !== normalizedInputOrgName) {
        //   console.error(`Organizer name mismatch: expected ${storedOrgName}, got ${orgName}`);
        //   toast.error('Invalid organizer dashboard');
        //   navigate('/404');
        //   return;
        // }

        setOrganizer(orgData);
      } catch (error) {
        console.error('Error fetching organizer:', error);
        toast.error('Failed to load dashboard');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizer();
  }, [orgName, currentUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-100">
        <div className="text-gray-600 text-lg animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  if (!organizer) return null;

  return (
    <div className="min-h-screen  py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1D3557] bg-clip-text bg-gradient-to-r from-[#1D3557] to-[#E63946]">
            Welcome, {organizer.orgName || organizer.name}
          </h1>
          <p className="mt-2 text-lg text-gray-600">Manage your events with ease and style</p>
        </div>

        {/* Organizer Details Card */}
        <div className="bg-[#1D3557] text-white rounded-2xl shadow-lg p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-6">Organizer Profile</h2>
          <div className='pl-10 flex self-center justify-start gap-20'>
            <div className='h-30 w-30 border rounded-full bg-[url("/images/orgProfile.jpg")] bg-cover bg-center'></div>
            

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <p className="text-gray-300 font-medium">Organization Name</p>
                <p className="text-lg">{organizer.orgName || organizer.name}</p>
              </div>
              <div>
                <p className="text-gray-300 font-medium">Email</p>
                <p className="text text-lg">{organizer.email}</p>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <p className="text-gray-300 font-medium">Description</p>
                <p className="text text-lg">{organizer.desc || 'No description'}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/complete-profile')}
            className="mt-6 bg-gradient-to-r from-[#E63946] to-[#F63956] text-white px-6 py-2 rounded-full hover:from-[#F63956] hover:to-[#E63946] transition-all duration-300 shadow-md"
          >
            Update Profile
          </button>
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#1D3557] mb-4 sm:mb-0">Your Events</h2>
            <button
              onClick={() => navigate(`/${organizer.name.toLowerCase().replace(/\s+/g, '-')}/create-event`)}
              className="bg-gradient-to-r from-[#1D3557] to-[#1D3577] text-white px-6 py-2 rounded-full hover:from-[#1D3577] hover:to-[#1D3557] transition-all duration-300 shadow-md"
            >
              Create New Event
            </button>
          </div>
          {events.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No events created yet. Start by creating one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-50 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-xl font-medium text-[#1D3557]">{event.title}</h3>
                    <p className="text-gray-600 mt-1">{event.description || 'No description'}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Date: {event.date || 'Not specified'} | Participants: {event.participants || 0}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditEvent(event.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;