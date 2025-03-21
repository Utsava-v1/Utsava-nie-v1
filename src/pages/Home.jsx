import React from "react";
import Hero from "../components/Hero"
import EventCard from "../components/EventCard";


function Home() {

  const events = [
    {
      id: 1,
      title: "What's Next",
      organizer: 'Anveshan',
      date: 'March 25, 2025',
      time: '6:00 PM',
      imgSrc: 'https://images.unsplash.com/photo-1725442224908-e2c81b767898?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      title: 'Ethnic Day',
      organizer: 'TechNIEks',
      date: 'March 28, 2025',
      time: '10:00 AM',
      imgSrc: 'https://images.unsplash.com/photo-1725442224908-e2c81b767898?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 3,
      title: 'Career Fair',
      organizer: 'Incubation Center',
      date: 'April 5, 2025',
      time: '9:00 AM',
      imgSrc: 'https://images.unsplash.com/photo-1725442224908-e2c81b767898?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 4,
      title: 'HackToWIn',
      organizer: 'IEEE',
      date: 'April 5, 2025',
      time: '9:00 AM',
      imgSrc: 'https://images.unsplash.com/photo-1725442224908-e2c81b767898?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 5,
      title: 'Mastering CLI',
      organizer: 'OWASP',
      date: 'April 5, 2025',
      time: '9:00 AM',
      imgSrc: 'https://images.unsplash.com/photo-1725442224908-e2c81b767898?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // Add more events as necessary
  ];

  return (
    <div>
      <Hero />
      <section className="py-7 text-center">
        <div className="container mx-auto px-5">
          <h2 className="text-[#1D3557] text-4xl mb-5">Upcoming Events</h2>
          <p className="text-[#2F3E46] text-lg mb-10">
            Join our community and participate in various events designed to foster learning, networking, and fun!
          </p>
        </div>
        <div className="event-cards max-w-300 justify-self-center flex flex-wrap justify-center items-center gap-5 m-5">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;
