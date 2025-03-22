import React from "react";
import Hero from "../components/Hero"
import EventCard from "../components/EventCard";
import eventList from "../assets/files/eventList.json"


function Home() {

  // const events = 

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
          {eventList.map((event) => (
            <EventCard key={event.event_id} {...event} />
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;
