const express = require("express");
const router = express.Router();
const db = require("../database"); // Ensure this correctly connects to MySQL

// API Endpoint to Get Recommended Guides (Existing Code)
router.get("/recommend-guides/:traveler_id", (req, res) => {
    const traveler_id = req.params.traveler_id;

    const query = `
        WITH TravelerData AS (
            SELECT 
                tp.user_id AS traveler_id, tp.preferredDestinations, tp.recentTrips, tp.languages
            FROM traveler_profile tp
            WHERE tp.user_id = ?
        )
        SELECT 
            gp.user_id AS guide_id, gp.fullName, gp.languagesSpoken, gp.specializedDestinations, gp.recentTrips,
            (CASE 
                WHEN gp.specializedDestinations LIKE CONCAT('%', td.preferredDestinations, '%') THEN 1 ELSE 0 
            END) +
            (CASE 
                WHEN gp.recentTrips LIKE CONCAT('%', td.recentTrips, '%') THEN 1 ELSE 0 
            END) +
            (CASE 
                WHEN gp.languagesSpoken LIKE CONCAT('%', td.languages, '%') THEN 1 ELSE 0 
            END) AS match_score
        FROM guide_profile gp
        JOIN TravelerData td ON 1=1
        WHERE 
            gp.specializedDestinations LIKE CONCAT('%', td.preferredDestinations, '%')
            OR gp.recentTrips LIKE CONCAT('%', td.recentTrips, '%')
            OR gp.languagesSpoken LIKE CONCAT('%', td.languages, '%')
        ORDER BY match_score DESC
        LIMIT 10;
    `;

    db.query(query, [traveler_id], (err, results) => {
        if (err) {
            console.error("❌ Error fetching guide recommendations:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

// ✅ New API Endpoint to Get Recommended Places Based on User Preferences
router.get("/recommend-places/:traveler_id", (req, res) => {
    const traveler_id = req.params.traveler_id;

    const query = `
        WITH TravelerData AS (
            SELECT 
                tp.user_id AS traveler_id, tp.preferredDestinations
            FROM traveler_profile tp
            WHERE tp.user_id = ?
        )
        SELECT 
            p.place_id, p.place_name, p.description, p.image_url, d.destination_name
        FROM places p
        JOIN destinations d ON p.destination_id = d.destination_id
        JOIN TravelerData td ON d.destination_name LIKE CONCAT('%', td.preferredDestinations, '%')
        ORDER BY d.destination_name ASC, p.place_name ASC
        LIMIT 20;
    `;

    db.query(query, [traveler_id], (err, results) => {
        if (err) {
            console.error("❌ Error fetching place recommendations:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

module.exports = router;
