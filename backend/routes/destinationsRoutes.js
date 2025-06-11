const express = require("express");
const router = express.Router();
const db = require("../database");

// ✅ API to fetch all destinations
router.get("/destinations", (req, res) => {
    const sql = "SELECT * FROM destinations";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching destinations:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// ✅ API to fetch a single destination by ID
router.get("/destinations/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM destinations WHERE destination_id = ?";
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error fetching destination:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.json(results[0]);
    });
});

module.exports = router;
