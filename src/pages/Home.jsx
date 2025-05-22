import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchOrganizer, setSearchOrganizer] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {

      const fallbackImages = [
        '/images/hotAirBalloons.jpg',
        'https://www.monginisbakery.com/website/assets/images/events/1.jpg',
        'https://theperfectevent.com/wp-content/uploads/2020/01/Main-Scroll-2.jpg',
        'https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg?auto=format,compress',
        "https://d194ip2226q57d.cloudfront.net/images/Event-Guide_Header_CO-Shutterstock.original.jpg",
        "https://static.vecteezy.com/system/resources/thumbnails/024/676/211/small/event-light-andgrade-concept-christmas-wreath-bokeh-lights-over-dim-blue-establishment-creative-resource-ai-generated-photo.jpeg"
      ];

      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let eventDate = 'Unknown Date';
          let rawDate = null;
          try {
            if (data.date && typeof data.date.toDate === 'function') {
              rawDate = data.date.toDate();
              eventDate = rawDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
            } else if (data.date instanceof Date) {
              rawDate = data.date;
              eventDate = rawDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
            } else if (data.date && typeof data.date === 'string') {
              const parsedDate = new Date(data.date);
              if (!isNaN(parsedDate)) {
                rawDate = parsedDate;
                eventDate = parsedDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
              }
            }
          } catch (err) {
            console.warn(`Error parsing date for event ${docSnap.id}:`, err);
          }

          let eventTime = 'Unknown Time';
          try {
            if (data.time && typeof data.time === 'string') {
              eventTime = new Date(`1970-01-01T${data.time}`).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });
            }
          } catch (err) {
            console.warn(`Error parsing time for event ${docSnap.id}:`, err);
          }

          const validTypes = ['Workshop', 'Seminar', 'Fest', "Club Event", 'Competition'];
          const eventType = validTypes.includes(data.type) ? data.type : 'General';

          let organizerName = '';
          let orgId = null;
          if (data.organizing_group_id && typeof data.organizing_group_id === 'string') {
            try {
              const orgDoc = await getDoc(doc(db, 'organizing_group', data.organizing_group_id));
              if (orgDoc.exists()) {
                console.log(orgDoc.data());
                organizerName = orgDoc.data().name || orgDoc.data().orgName || 'Organizer'; // Unknown Organizer
                orgId = data.organizing_group_id;
                console.log(`Fetched organizer for event ${docSnap.id}:`, {
                  orgId: data.organizing_group_id,
                  name: orgDoc.data().name,
                });
              } else {
                console.warn(`Organizer document not found for ID: ${data.organizing_group_id}`);
              }
            } catch (err) {
              console.warn(`Error fetching organizer ${data.organizing_group_id}:`, err);
            }
          }

          return {
            id: docSnap.id,
            name: data.name || data.eventName || 'Untitled Event',
            rawDate,
            formattedDate: eventDate,
            time: eventTime,
            venue: data.venue || 'Unknown Venue',
            description: data.description && data.description.length > 1 ? data.description : 'No description available',
            type: eventType,
            organizer: organizerName,
            organizing_group_id: orgId,
            image: data.imageUrl || fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
            registrations: typeof data.registrations === 'number' ? data.registrations : 0,
          };
        })
      );

      const now = new Date();
      const upcomingEvents = eventsData
        .filter((event) => {
          if (!event.rawDate) return false;
          const eventDateTime = new Date(event.rawDate);
          if (event.time && typeof event.time === 'string') {
            const [hour, minute] = event.time.match(/\d+/g) || [0, 0];
            eventDateTime.setHours(+hour || 0);
            eventDateTime.setMinutes(+minute || 0);
          }
          return eventDateTime >= now;
        })
        .sort((a, b) => a.rawDate - b.rawDate);

      setEvents(upcomingEvents);
      setFilteredEvents(upcomingEvents);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      toast.error('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let result = [...events];

    if (searchName.trim()) {
      result = result.filter((event) =>
        event.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchOrganizer.trim()) {
      result = result.filter((event) =>
        event.organizer.toLowerCase().includes(searchOrganizer.toLowerCase())
      );
    }

    if (filterDate) {
      const selectedDate = new Date(filterDate);
      selectedDate.setHours(0, 0, 0, 0);
      result = result.filter((event) => {
        if (!event.rawDate) return false;
        const eventDate = new Date(event.rawDate);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === selectedDate.getTime();
      });
    }

    setFilteredEvents(result);
  }, [searchName, searchOrganizer, filterDate, events]);

  const handleResetFilters = () => {
    setSearchName('');
    setSearchOrganizer('');
    setFilterDate('');
    setFilteredEvents(events);
  };

  const handleRegisterClick = (eventId) => {
    if (!currentUser) {
      console.log('Register attempted without login, redirecting to /login');
      toast.error('Please log in to register for events.');
      navigate('/login');
      return;
    }
    console.log('Navigating to register:', { eventId, userId: currentUser.uid });
    navigate(`/${eventId}/register`);
  };

  return (
    <div className='relative'>
      <Hero />
      <section className="text-center relative">
        <div className='bg-[url("/images/randombg.jpeg")] backdrop-blur-sm !p-3'>
          <h2 className="text-3xl font-bold text-white mb-6">Upcoming Events</h2>

          <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="text"
              placeholder="Search by event name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="bg-white w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1D3557] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Search by organizer"
              value={searchOrganizer}
              onChange={(e) => setSearchOrganizer(e.target.value)}
              className="bg-white w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1D3557] focus:outline-none"
            />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-white w-full sm:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1D3557] focus:outline-none"
            />
            <button
              onClick={handleResetFilters}
              className="bg-[#E63946] text-white px-4 py-2 rounded-md hover:bg-[#F63956] transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Modal Popup */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm transition-all duration-300">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 mx-4 animate-fadeIn">
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-semibold"
                aria-label="Close modal"
              >
                ×
              </button>

              {/* Event Image */}
              <img
                src={selectedEvent.image}
                alt="Event"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              {/* Event Title */}
              <h2 className="text-2xl font-bold text-[#1D3557] mb-2">
                {selectedEvent.name}
              </h2>

              {/* Event Details */}
              <div className="space-y-1 text-left text-sm sm:text-base text-gray-700">
                <p><strong>📅 Date:</strong> {selectedEvent.date}</p>
                <p><strong>🕒 Time:</strong> {selectedEvent.time}</p>
                <p><strong>📍 Venue:</strong> {selectedEvent.venue}</p>
                <p><strong>🧑‍💼 Organizer:</strong> {selectedEvent.organizer}</p>
                <p><strong>🏷️ Type:</strong> {selectedEvent.type}</p>
                <p><strong>👥 Registrations:</strong> {selectedEvent.registrations}</p>
                <p className="mt-2"><strong>📝 Description:</strong> {selectedEvent.description}</p>
              </div>

              {/* Optional Actions */}
              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm text-gray-800 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleRegisterClick(selectedEvent.id);
                    setTimeout(() => setSelectedEvent(null), 100);
                  }}
                  className="px-4 py-2 bg-[#1D3557] hover:bg-[#E63946] text-white rounded-md text-sm transition"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="event-cards flex flex-wrap justify-center items-center gap-5 m-5">
          {loading ? (
            <div className="text-center">
              <ClipLoader color="#1D3557" size={40} />
              <p className="mt-2 text-gray-600">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <p className="text-gray-600">No events match your filters.</p>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                {...event}
                date={event.formattedDate}
                onDetailsClick={(eventData) => setSelectedEvent(eventData)}
                onRegisterClick={() => handleRegisterClick(event.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;