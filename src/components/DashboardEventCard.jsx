import React from 'react'
import { Link } from 'react-router-dom'

const DashboardEventCard = ({ id, title, date, type, participants, isUpcoming }) => {
    return (
        <div className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white w-full max-w-[320px]">
            <h3 className="text-lg font-semibold text-[#1D3557]">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">Date: {date}</p>

            {type && (
                <p className="text-sm text-gray-500 mt-1">Type: <span className="font-medium">{type}</span></p>
            )}

            {participants !== undefined && (
                <p className="text-sm text-gray-500 mt-1">Participants: <span className="font-medium">{participants}</span></p>
            )}

            <div className="flex gap-2 mt-3">
                {isUpcoming ? (
                    <>
                        <Link
                            to={`/edit-event/${id}`}
                            className="text-sm underline text-[#1D3557] hover:text-[#457B9D]"
                        >
                            Edit
                        </Link>
                        <Link
                            to={`/manage-event/${id}`}
                            className="text-sm underline text-[#1D3557] hover:text-[#457B9D]"
                        >
                            Manage
                        </Link>
                    </>
                ) : (
                    <Link
                        to={`/stats/${id}`}
                        className="text-sm underline text-[#1D3557] hover:text-[#457B9D]"
                    >
                        View Stats
                    </Link>
                )}
            </div>
        </div>
    )
}

export default DashboardEventCard
