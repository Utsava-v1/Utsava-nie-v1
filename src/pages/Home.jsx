import React from "react";
import Hero from "../components/Hero"
import EventCard from "../components/EventCard";


function Home() {

  const events = [
    {
      id: 1,
      title: 'Networking Night',
      organizer: 'John Doe',
      date: 'March 25, 2025',
      time: '6:00 PM',
      imgSrc: 'https://images.unsplash.com/photo-1725442224908-e2c81b767898?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      title: 'Tech Symposium',
      organizer: 'Jane Smith',
      date: 'March 28, 2025',
      time: '10:00 AM',
      imgSrc: 'https://images.unsplash.com/photo-1725442224908-e2c81b767898?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 3,
      title: 'Career Fair',
      organizer: 'College Career Center',
      date: 'April 5, 2025',
      time: '9:00 AM',
      imgSrc: 'https://images.unsplash.com/photo-1725442224908-e2c81b767898?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // Add more events as necessary
  ];

  return (
    <div>
      <Hero />
      <section className="py-20 text-center">
        <div className="container mx-auto px-5">
          <h2 className="text-[#1D3557] text-4xl mb-5">Upcoming Events</h2>
          <p className="text-[#2F3E46] text-lg mb-10">
            Join our community and participate in various events designed to foster learning, networking, and fun!
          </p>
          <div className="event-cards flex flex-wrap gap-5 mt-10 justify-center">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
