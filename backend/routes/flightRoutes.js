const express = require("express");
const router = express.Router();
const db = require("../database");

// Get flight details based on place_id
router.get("/flights/:place_id", (req, res) => {
    const place_id = req.params.place_id;
    const query = "SELECT * FROM flights WHERE place_id = ?";
    
    db.query(query, [place_id], (err, results) => {
        if (err) {
            console.error("Error fetching flight details:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

module.exports = router;
