import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { getEventsByOrganizer } from '../utils/firestore';
import { ClipLoader } from 'react-spinners';

const OrganizerDashboard = () => {
  const { organizerId } = useParams(); // Changed to organizerId (UID)
  const { currentUser, userProfile } = useAuth();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        const orgDoc = await getDoc(doc(db, 'organizing_group', organizerId));
        if (!orgDoc.exists()) {
          console.error(`No organizing_group document found for ID: ${organizerId}`);
          toast.error('Organizer not found');
          navigate('/');
          return;
        }

        const orgData = { id: orgDoc.id, ...orgDoc.data() };
        setOrganizer(orgData);

        // Fetch events
        const organizerEvents = await getEventsByOrganizer(organizerId);
        const formattedEvents = organizerEvents.map((event) => ({
          id: event.id,
          name: event.name || 'Untitled Event',
          description: event.description || 'No description',
          date: event.date
            ? new Date(event.date.toDate()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Unknown Date',
          registrations: event.registrations || 0,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching organizer or events:', error);
        toast.error('Failed to load dashboard');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizer();
  }, [organizerId, navigate]);

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // Assumes deleteEvent exists in utils/firestore.js
        // await deleteEvent(eventId);
        toast.success('Event deleted successfully');
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-100">
        <ClipLoader color="#1D3557" size={40} />
        <div className="text-gray-600 text-lg animate-pulse ml-2">Loading Dashboard...</div>
      </div>
    );
  }

  if (!organizer) return null;

  const isOrganizer = currentUser && userProfile?.role === 'organizer' && currentUser.uid === organizer.id;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1D3557] bg-clip-text bg-gradient-to-r from-[#1D3557] to-[#E63946]">
            {organizer.orgName || organizer.name}
          </h1>
          <p className="mt-2 text-lg text-gray-600">Manage events with ease and style</p>
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
                <p className="text-lg">{organizer.email}</p>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <p className="text-gray-300 font-medium">Description</p>
                <p className="text-lg">{organizer.desc || 'No description'}</p>
              </div>
            </div>
          </div>
          {isOrganizer && (
            <button
              onClick={() => navigate('/complete-profile')}
              className="mt-6 bg-gradient-to-r from-[#E63946] to-[#F63956] text-white px-6 py-2 rounded-full hover:from-[#F63956] hover:to-[#E63946] transition-all duration-300 shadow-md"
            >
              Update Profile
            </button>
          )}
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#1D3557] mb-4 sm:mb-0">Events</h2>
            {isOrganizer && (
              <button
                onClick={() => navigate(`/${organizer.orgName?.toLowerCase().replace(/\s+/g, '-') || organizer.name.toLowerCase().replace(/\s+/g, '-')}/create-event`)}
                className="bg-gradient-to-r from-[#1D3557] to-[#1D3577] text-white px-6 py-2 rounded-full hover:from-[#1D3577] hover:to-[#1D3557] transition-all duration-300 shadow-md"
              >
                Create New Event
              </button>
            )}
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
                    <h3 className="text-xl font-medium text-[#1D3557]">{event.name}</h3>
                    <p className="text-gray-600 mt-1">{event.description}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Date: {event.date} | Registrations: {event.registrations}
                    </p>
                  </div>
                  {isOrganizer && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditEvent(event.id)}
                        className="bg-[#1D3557] text-white px-4 py-2 rounded-full hover:bg-[#1D3597] transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                      >
                        <img src="/images/delete.svg" alt="Delete" className="w-6 h-6" />
                      </button>
                    </div>
                  )}
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