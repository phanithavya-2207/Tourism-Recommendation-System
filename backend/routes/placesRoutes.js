const express = require("express");
const db = require("../database");

const router = express.Router();

// Get places by destination_id
router.get("/places/:destination_id", (req, res) => {
    const destination_id = req.params.destination_id;

    const sql = "SELECT * FROM places WHERE destination_id = ?";
    
    db.query(sql, [destination_id], (err, results) => {
        if (err) {
            console.error("Error fetching places:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
    });
});

module.exports = router;
