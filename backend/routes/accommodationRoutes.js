const express = require("express");
const router = express.Router();
const db = require("../database");

// Get accommodations based on place_id
router.get("/accommodations/:place_id", (req, res) => {
    const place_id = req.params.place_id;
    const query = "SELECT * FROM accommodations WHERE place_id = ?";
    
    db.query(query, [place_id], (err, results) => {
        if (err) {
            console.error("Error fetching accommodations:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

module.exports = router;
