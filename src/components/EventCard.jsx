import React from 'react';

const EventCard = ({ title, organizer, date, time, imgSrc }) => {
    return (
        <div className="event-card bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:translate-y-[-5px] hover:shadow-xl w-[calc(33.333%-20px)] mb-5">
            <img src={imgSrc} alt="Event Image" className="w-full h-[250px] object-cover" />
            <div className="event-card-body p-5 text-left">
                <h3 className="text-[#1D3557] text-2xl mb-2">{title}</h3>
                <div className="organizer text-[#A8DADC] text-lg mb-2">By {organizer}</div>
                <div className="date-time text-[#2F3E46] text-lg mb-5">Date: {date} | Time: {time}</div>
                <a href="#" className="btn bg-[#1D3557] text-white py-3 px-7 text-lg uppercase mr-2 hover:bg-[#E63946] transition-colors">Register</a>
                <a href="#" className="btn bg-[#1D3557] text-white py-3 px-7 text-lg uppercase hover:bg-[#E63946] transition-colors">Details</a>
            </div>
        </div>
    );
};

export default EventCard;
