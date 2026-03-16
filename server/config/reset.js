import { pool } from './database.js'
import './dotenv.js'
import eventData from '../data/events.js'

const createTables = async () => {
    const createTablesQuery = `
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS locations;

    CREATE TABLE locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        zip VARCHAR(20),
        image VARCHAR(255)
    );

    CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        location_id INTEGER REFERENCES locations(id),
        date DATE,
        time TIME
    );
    `
    try {
        await pool.query(createTablesQuery)
        console.log('Tables created successfully')
    } catch (error) {
        console.error('Error creating tables:', error)
    }
}

const seedLocations = async () => {
    const locations = [
        { name: 'Gramercy Theatre', address: '127 E 23rd St', city: 'New York', state: 'NY', zip: '10010', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Gramercy_Theatre.jpg/320px-Gramercy_Theatre.jpg' },
        { name: 'Met Life Stadium', address: '1 MetLife Stadium Dr', city: 'East Rutherford', state: 'NJ', zip: '07073', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/MetLife_Stadium_2019.jpg/320px-MetLife_Stadium_2019.jpg' },
        { name: 'Flushing Meadows Corona Park', address: 'Flushing Meadows', city: 'Queens', state: 'NY', zip: '11368', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Queens_Museum_at_Night.jpg/320px-Queens_Museum_at_Night.jpg' },
        { name: 'American Airlines Arena', address: '601 Biscayne Blvd', city: 'Miami', state: 'FL', zip: '33132', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Kaseya_Center_exterior.jpg/320px-Kaseya_Center_exterior.jpg' },
    ]

    for (const loc of locations) {
        await pool.query(
            'INSERT INTO locations (name, address, city, state, zip, image) VALUES ($1, $2, $3, $4, $5, $6)',
            [loc.name, loc.address, loc.city, loc.state, loc.zip, loc.image]
        )
        console.log(`Location "${loc.name}" inserted`)
    }
}

const seedEvents = async () => {
    const locResult = await pool.query('SELECT id, name FROM locations')
    const locationMap = {}
    locResult.rows.forEach(row => {
        locationMap[row.name.toLowerCase()] = row.id
    })

    for (const event of eventData) {
        const locationName = event.location?.toLowerCase() || ''
        let locationId = locationMap[locationName]

        if (!locationId) {
            if (locationName.includes('gramercy')) locationId = locationMap['gramercy theatre']
            else if (locationName.includes('met life') || locationName.includes('metlife')) locationId = locationMap['met life stadium']
            else if (locationName.includes('flushing') || locationName.includes('flusing')) locationId = locationMap['flushing meadows corona park']
            else if (locationName.includes('american')) locationId = locationMap['american airlines arena']
        }

        if (!locationId) {
            console.warn(`No location found for event: "${event.artistName}" at "${event.location}"`)
            continue
        }

        try {
            await pool.query(
                'INSERT INTO events (title, image, location_id, date, time) VALUES ($1, $2, $3, $4, $5)',
                [event.artistName, event.image, locationId, event.date, event.time]
            )
            console.log(`Event "${event.artistName}" inserted`)
        } catch (error) {
            console.error(`Error inserting event "${event.artistName}":`, error.message)
        }
    }
}

const seed = async () => {
    await createTables()
    await seedLocations()
    await seedEvents()
    pool.end()
}

seed()
