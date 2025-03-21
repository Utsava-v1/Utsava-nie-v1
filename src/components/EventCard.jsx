import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ title, organizer, date, time, imgSrc }) => {
    return (
        <div className="event-card bg-white rounded-lg min-w-80 shadow-lg transition-transform transform hover:translate-y-[-5px] hover:shadow-xl w-[calc(33.333%-20px)]">
            <img src={imgSrc} alt="Event Image" className="w-full object-cover rounded-t-lg" />
            <div className="event-card-body p-5 text-left">
                <h3 className="text-[#1D3557] text-2xl mb-2">{title}</h3>
                <Link className="organizer text-[#00a8ad] text-lg mb-2">By {organizer}</Link>
                <div className="date-time text-[#2F3E46] text-lg mb-5">Date: {date} | Time: {time}</div>
                <div className='flex flex-wrap'>
                    <a href="#" className="btn bg-[#1D3557] text-white py-3 px-7 text-lg uppercase mr-2 hover:bg-[#E63946] transition-colors">Register</a>
                    <a href="#" className="btn bg-[#1D3557] text-white py-3 px-7 text-lg uppercase hover:bg-[#E63946] transition-colors">Details</a>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
