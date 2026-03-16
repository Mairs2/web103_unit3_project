import React, { useState, useEffect } from 'react'
import Event from '../components/Event'
import EventsAPI from '../services/EventsAPI'
import '../css/AllEvents.css'

const AllEvents = () => {
    const [events, setEvents] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('all')

    useEffect(() => {
        (async () => {
            try {
                const data = await EventsAPI.getAllEvents()
                setEvents(data)
            } catch (error) {
                throw error
            }
        })()
    }, [])

    const locations = ['all', ...new Set(events.map(e => e.location_name).filter(Boolean))]

    const filtered = selectedLocation === 'all'
        ? events
        : events.filter(e => e.location_name === selectedLocation)

    return (
        <div className='all-events'>
            <div className='all-events-controls'>
                <label htmlFor='location-filter'>Filter by location:</label>
                <select
                    id='location-filter'
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                >
                    {locations.map(loc => (
                        <option key={loc} value={loc}>
                            {loc === 'all' ? 'All Locations' : loc}
                        </option>
                    ))}
                </select>
            </div>

            <div className='all-events-grid'>
                {filtered.length > 0
                    ? filtered.map(event => (
                        <Event
                            key={event.id}
                            id={event.id}
                            title={event.title}
                            date={event.date}
                            time={event.time}
                            image={event.image}
                        />
                    ))
                    : <h2>No events found.</h2>
                }
            </div>
        </div>
    )
}

export default AllEvents
