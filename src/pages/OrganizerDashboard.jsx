import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import organizerList from '../assets/files/organizerList.json'
import eventList from '../assets/files/eventList.json'
import DashboardEventCard from '../components/DashboardEventCard'

const OrganizerDashboard = () => {
    const { organizerName } = useParams()
    const navigate = useNavigate()
    const [organizer, setOrganizer] = useState(null)

    useEffect(() => {
        const foundOrganizer = organizerList.organizers.find(org => 
            org.name.toLowerCase().replace(/\s+/g, '-') === organizerName.toLowerCase()
        )

        if (!foundOrganizer) {
            navigate('/404')
        } else {
            setOrganizer(foundOrganizer)
        }
    }, [organizerName, navigate])

    if (!organizer) return null

    const pastEvents = eventList.filter(event => organizer.past_events.includes(event.event_id))
    const upcomingEvents = eventList.filter(event => organizer.upcoming_events.includes(event.event_id))

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Club Info Section */}
            <div className="bg-[#1D3557] text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                    <img 
                        src={organizer.logo} 
                        alt={organizer.name} 
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{organizer.name}</h1>
                        <p className="text-sm mt-1">Established on: <span className="font-medium">2018-04-12</span></p>
                        <p>
                            Faculty Advisor: 
                            <Link 
                                to={`/faculty/${organizer.faculty_adviser.toLowerCase().replace(/\s+/g, '-')}`}
                                className="underline ml-1"
                            >
                                {organizer.faculty_adviser}
                            </Link>
                        </p>
                        <p className="mt-2 text-sm">{organizer.description}</p>
                    </div>
                </div>
                
                {/* Core Members */}
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Core Members:</h2>
                    <div className="flex gap-4 mt-2 flex-wrap">
                        {organizer.core_members.map(member => (
                            <Link 
                                key={member.usn}
                                to={`/student/${member.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm underline text-[#A8DADC] hover:text-[#F1FAEE]"
                            >
                                {member.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Event Button */}
            <div className="flex justify-end mt-6">
                <Link 
                    to={`/${organizer.name.toLowerCase().replace(/\s+/g, '-')}/create-event`} 
                    className="bg-[#E63946] text-white px-4 py-2 rounded-md hover:bg-[#D62828] transition"
                >
                    + Create Event
                </Link>
            </div>

            {/* Upcoming Events */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                <div className="flex gap-4 flex-wrap">
                    {upcomingEvents.map(event => (
                        <DashboardEventCard 
                            key={event.event_id}
                            id={event.event_id}
                            title={event.name}
                            date={event.date}
                            type={event.type}
                            participants={event.participants}
                            isUpcoming={true}
                        />
                    ))}
                </div>
            </div>

            {/* Past Events */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Past Events</h2>
                <div className="flex gap-4 flex-wrap">
                    {pastEvents.map(event => (
                        <DashboardEventCard 
                            key={event.event_id}
                            id={event.event_id}
                            title={event.name}
                            date={event.date}
                            type={event.type}
                            participants={event.participants}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OrganizerDashboard
