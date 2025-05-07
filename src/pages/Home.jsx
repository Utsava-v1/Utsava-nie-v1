import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import EventCard from "../components/EventCard";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate(); // 👈

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const eventDate = data.date.toDate().toLocaleDateString();
        const eventTime = data.time.toDate
          ? data.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : data.time;

        let organizerName = "Unknown Organizer";
        if (data.organizing_group_id) {
          const orgDoc = await getDoc(data.organizing_group_id);
          if (orgDoc.exists()) organizerName = orgDoc.data().name;
        }

        return {
          event_id: docSnap.id,
          name: data.name,
          date: eventDate,
          time: eventTime,
          venue: data.venue,
          description: data.description,
          organizer: organizerName,
          image: data.poster_url || "/images/hotAirBalloons.jpg"
        };
      }));

      setEvents(eventsData);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <Hero />
      <section className="py-7 text-center relative">
        {/* ...Heading... */}

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
              <p className="text-gray-600 mb-1"><strong>Organizer:</strong> {selectedEvent.organizer}</p>
              <p className="text-gray-600 mb-1"><strong>Date:</strong> {selectedEvent.date}</p>
              <p className="text-gray-600 mb-1"><strong>Time:</strong> {selectedEvent.time}</p>
              <p className="text-gray-600 mb-1"><strong>Venue:</strong> {selectedEvent.venue}</p>
              <p className="text-gray-600 mb-3"><strong>Description:</strong> {selectedEvent.description}</p>
              <img src={selectedEvent.image} alt="Event Poster" className="w-full h-64 object-cover rounded" />
            </div>
          </div>
        )}

        <div className="event-cards flex flex-wrap justify-center items-center gap-5 m-5">
          {loading ? (
            <p>Loading...</p>
          ) : (
            events.map((event) => {
              const eventSlug = event.event_id; // 👈 convert name to URL-friendly format

              return (
                <EventCard
                  key={event.event_id}
                  {...event}
                  onDetailsClick={() => setSelectedEvent(event)}
                  onRegisterClick={() => navigate(`/${eventSlug}/register`)} // 👈 navigate to /event-name/register
                />
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
