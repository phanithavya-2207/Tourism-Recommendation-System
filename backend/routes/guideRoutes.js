const express = require("express");
const router = express.Router();
const db = require("../database");

// Fetch all tourist guides
router.get("/guides", (req, res) => {
    const sql = "SELECT * FROM guide_profile";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching guides:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Handle booking request
router.post("/bookings", (req, res) => {
    const { user_id, destination_id, place_id, accommodation_id, transportation_id, stay_duration, amount, booking_status, guide_id } = req.body;

    if (!user_id || !destination_id || !place_id || !stay_duration || !amount || !booking_status) {
        return res.status(400).json({ error: "Missing required booking fields" });
    }

    const sql = `
        INSERT INTO bookings
        (user_id, destination_id, place_id, accommodation_id, transportation_id, stay_duration, amount, booking_status, guide_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [user_id, destination_id, place_id, accommodation_id, transportation_id, stay_duration, amount, booking_status, guide_id || null], 
        (err, result) => {
            if (err) {
                console.error("Error inserting booking:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ message: "Booking confirmed successfully!", bookingId: result.insertId });
        }
    );
});

router.get("/guide-bookings/:user_id", (req, res) => {
    const { user_id } = req.params;

    const sql = `
        SELECT 
            b.booking_id AS booking_id,
            b.destination_id, d.destination_name, 
            b.place_id, p.place_name, 
            b.stay_duration, b.amount, b.booking_status, 
            r.username AS traveler_name, 
            r.email AS traveler_email,
            r.phone AS traveler_phone,
            g.fullName AS guide_name,
            b.booking_date
        FROM bookings b
        JOIN guide_profile g ON b.guide_id = g.id
        JOIN register_data r ON b.user_id = r.id  
        JOIN destinations d ON b.destination_id = d.destination_id
        JOIN places p ON b.place_id = p.place_id
        WHERE g.user_id = ?;
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("Error fetching guide bookings:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "No bookings found for this guide." });
        }
        res.json(results);
    });
});

router.get("/traveler-bookings/:user_id", (req, res) => {
    const { user_id } = req.params;

    const sql = `
        SELECT 
            b.booking_id AS booking_id,
            d.destination_name, 
            p.place_name, 
            b.stay_duration, 
            b.amount, 
            b.booking_status, 
            g.fullName AS guide_name,
            g.email AS guide_email,
            g.phone AS guide_phone,
            b.booking_date
        FROM bookings b
        LEFT JOIN guide_profile g ON b.guide_id = g.id
        JOIN destinations d ON b.destination_id = d.destination_id
        JOIN places p ON b.place_id = p.place_id
        WHERE b.user_id = ?;
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("Error fetching traveler bookings:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "No bookings found for this traveler." });
        }
        res.json(results);
    });
});


module.exports = router;