import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({
  id,
  name,
  organizer,
  date,
  time,
  venue,
  description,
  type,
  image,
  organizing_group_id,
  registrations,
  onDetailsClick,
  onRegisterClick,
}) => {
  const defaultImage = '/images/hotAirBalloons.jpg';
  const imgSrc = image || defaultImage;
  const eventName = name || '-no event name-';
  const orgNav = organizer?.toLowerCase().replace(/\s+/g, '-') || 'unknown';

  return (
    <div className="event-card bg-white rounded-lg min-w-80 shadow-sm shadow-black/50 transition-transform transform hover:translate-y-[-5px] hover:shadow-xl w-[calc(33.333%-20px)]">
      <img src={imgSrc} alt="Event Image" className="w-full p-2 brightness-80 object-cover rounded-t-lg h-48" />
      <div className="event-card-body p-5 text-left">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[#1D3557] text-2xl mb-2 h-10 w-full overflow-hidden">{eventName}</h3>
          <span className="text-sm text-gray-600 text-center bg-gray-200 !p-2 rounded-full">
            {registrations ?? 0} regis...
          </span>
        </div>
        <Link to={`/${orgNav}/dashboard`} className="organizer text-[#00a8ad] text-lg mb-2 hover:underline">
          By {organizer || 'Unknown Organizer'}
        </Link>
        <div className="date-time text-[#2F3E46] text-lg mb-5">Date: {date} | Time: {time}</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              console.log('Register button clicked for event:', id);
              onRegisterClick();
            }}
            className="btn bg-[#1D3557] text-white py-2.5 px-6 text-base uppercase hover:bg-[#E63946] transition-colors rounded-md"
          >
            Register
          </button>
          <button
            onClick={() =>
              onDetailsClick({
                id,
                name,
                organizer,
                date,
                time,
                venue,
                description,
                type,
                image: imgSrc,
                organizing_group_id,
                registrations,
              })
            }
            className="btn bg-[#1D3557] text-white py-2.5 px-6 text-base uppercase hover:bg-[#E63946] transition-colors rounded-md"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;