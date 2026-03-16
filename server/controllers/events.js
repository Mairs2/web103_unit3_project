import { pool } from "../config/database.js";

const getEvents = async (req, res) => {
    try {
        const results = await pool.query(
            `SELECT events.*, locations.name AS location_name
             FROM events
             LEFT JOIN locations ON events.location_id = locations.id
             ORDER BY events.id ASC`
        );
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const getEventsByLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await pool.query(
            "SELECT * FROM events WHERE location_id = $1 ORDER BY date ASC",
            [id]
        );
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

export { getEvents, getEventsByLocation };
