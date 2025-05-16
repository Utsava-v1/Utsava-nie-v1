import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const EventCard = ({ id, name, organizer, date, time, image }) => {
    const [registrationCount, setRegistrationCount] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const defaultImage = '/images/hotAirBalloons.jpg';
    const imgSrc = image || defaultImage;
    const eventName = name || "-no event name-";
    const orgNav = organizer?.toLowerCase().replace(/\s+/g, '-');

    useEffect(() => {
        if (!id) return;

        const q = query(
            collection(db, 'registrations'),
            where('event_id', '==', id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setRegistrationCount(snapshot.registrations);
        });

        return () => unsubscribe();
    }, [id]);

    return (
        <div className="event-card relative bg-white rounded-lg min-w-80 shadow-lg transition-transform transform hover:translate-y-[-5px] hover:shadow-xl w-[calc(33.333%-20px)]">
            <img src={imgSrc} alt="Event Image" className="w-full object-cover rounded-t-lg h-48" />
            <div className="event-card-body p-5 text-left">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[#1D3557] text-2xl mb-2 h-10 w-full overflow-hidden">{eventName}</h3>
                    <span className="text-sm text-gray-600 text-center bg-gray-200 !p-2 rounded-full">
                        {registrationCount} regis...
                    </span>
                </div>
                <Link to={`/${orgNav}/dashboard`} className="organizer text-[#00a8ad] text-lg mb-2 hover:underline">
                    By {organizer}
                </Link>
                <div className="date-time text-[#2F3E46] text-lg mb-5">Date: {date} | Time: {time}</div>
                <div className='flex flex-wrap gap-2'>
                    <Link to={`/event/${id}/register`} className="btn bg-[#1D3557] text-white py-2.5 px-6 text-base uppercase hover:bg-[#E63946] transition-colors rounded-md">
                        Register
                    </Link>
                    <button
                        onClick={() => setShowDetails(true)}
                        className="btn bg-[#1D3557] text-white py-2.5 px-6 text-base uppercase hover:bg-[#E63946] transition-colors rounded-md"
                    >
                        Details
                    </button>
                </div>
            </div>

            {/* Event Details Modal */}
            {showDetails && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-99">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-[#1D3557]">{eventName}</h2>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4 flex flex-wrap z-99">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Organizer</h3>
                                <p className="text-gray-600">{organizer}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Date</h3>
                                <p className="text-gray-600">{date}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Time</h3>
                                <p className="text-gray-600">{time}</p>
                            </div>
                            <div>
                                <img
                                    src={imgSrc}
                                    alt="Event Poster"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCard;