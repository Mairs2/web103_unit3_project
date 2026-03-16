const EventsAPI = {
    getAllEvents: async () => {
        const response = await fetch(`/api/events`)
        const data = await response.json()
        return data
    },
    getEventsByLocation: async (locationId) => {
        const response = await fetch(`/api/locations/${locationId}/events`)
        const data = await response.json()
        return data
    }
}

export default EventsAPI