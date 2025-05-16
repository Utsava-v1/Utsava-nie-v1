import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
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
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          console.log(data);
          

          // Handle date (Timestamp, Date, or string)
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

          // Handle time (string)
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

          // Validate event type
          const validTypes = ['Workshop', 'Seminar', 'Fest', 'Club Event', 'Competition'];
          const eventType = validTypes.includes(data.type) ? data.type : 'General';

          // Fetch organizer name
          let organizerName = 'Unknown Organizer';
          let orgId = null;
          if (data.organizing_group_id && typeof data.organizing_group_id === 'string') {
            try {
              const orgDoc = await getDoc(doc(db, 'organizing_group', data.organizing_group_id));
              if (orgDoc.exists()) {
                organizerName = orgDoc.data().orgName || 'Unknown Organizer';
                orgId = data.organizing_group_id;
              } else {
                console.warn(`Organizer document not found for ID: ${data.organizing_group_id}`);
              }
            } catch (err) {
              console.warn(`Error fetching organizer ${data.organizing_group_id}:`, err);
            }
          }

          return {
            id: docSnap.id,
            name: data.name || 'Untitled Event',
            rawDate,
            formattedDate: eventDate,
            time: eventTime,
            venue: data.venue || 'Unknown Venue',
            description: data.description && data.description.length > 1 ? data.description : 'No description available',
            type: eventType,
            organizer: organizerName,
            organizing_group_id: orgId,
            image: data.imageUrl || '/images/hotAirBalloons.jpg',
          };
        })
      );

      // Filter upcoming events and sort by date
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
    // Apply filters and search
    let result = [...events];

    // Search by event name
    if (searchName.trim()) {
      result = result.filter((event) =>
        event.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Search by organizer name
    if (searchOrganizer.trim()) {
      result = result.filter((event) =>
        event.organizer.toLowerCase().includes(searchOrganizer.toLowerCase())
      );
    }

    // Filter by date
    if (filterDate) {
      const selectedDate = new Date(filterDate);
      selectedDate.setHours(0, 0, 0, 0); // Normalize to start of day
      result = result.filter((event) => {
        if (!event.rawDate) return false;
        const eventDate = new Date(event.rawDate);
        eventDate.setHours(0, 0, 0, 0); // Normalize to start of day
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

  return (
    <div>
      <Hero />
      <section className=" py-7 text-center relative">
        <div className='bg-white !p-3'>

          <h2 className="text-3xl font-bold text-[#1D3557] mb-6">Upcoming Events</h2>

          {/* Filters and Search */}
          <div className=" max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="text"
              placeholder="Search by event name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1D3557] focus:outline-none"
            />
            <input
              type="text"
              placeholder="Search by organizer"
              value={searchOrganizer}
              onChange={(e) => setSearchOrganizer(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1D3557] focus:outline-none"
            />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full sm:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1D3557] focus:outline-none"
            />
            <button
              onClick={handleResetFilters}
              className="bg-[#E63946] text-white px-4 py-2 rounded-md hover:bg-[#F63956] transition"
            >
              Reset
            </button>
          </div>

        </div>
        {/* Popup */}
        {selectedEvent && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md w-[80%] max-w-[700px] relative">
              <button
                className="absolute top-2 right-4 text-xl font-bold text-gray-700 hover:text-red-500"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-2">{selectedEvent.name}</h2>
              <p className="text-gray-600 mb-1">
                <strong>Organizer:</strong> {selectedEvent.organizer}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Date:</strong> {selectedEvent.formattedDate}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Time:</strong> {selectedEvent.time}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Venue:</strong> {selectedEvent.venue}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Type:</strong> {selectedEvent.type}
              </p>
              <p className="text-gray-600 mb-3">
                <strong>Description:</strong> {selectedEvent.description}
              </p>
              <img
                src={selectedEvent.image}
                alt="Event Poster"
                className="w-full h-64 object-cover rounded"
              />
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
                id={event.id}
                name={event.name}
                organizer={event.organizer}
                date={event.formattedDate}
                time={event.time}
                venue={event.venue}
                description={event.description}
                type={event.type}
                image={event.image}
                organizing_group_id={event.organizing_group_id}
                onDetailsClick={() => setSelectedEvent(event)}
                onRegisterClick={() => navigate(`/${event.id}/register`)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;