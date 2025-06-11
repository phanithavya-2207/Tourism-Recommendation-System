const express = require("express");
const router = express.Router();
const db = require("../database");

// ✅ Get traveler profile
router.get("/traveler-profile/:userId", (req, res) => {
    const userId = req.params.userId;
    const query = "SELECT * FROM traveler_profile WHERE user_id = ?";

    db.query(query, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });
        if (result.length === 0) return res.status(404).json({ message: "Traveler profile not found" });
        res.json(result[0]);
    });
});

// ✅ Insert/Update traveler profile
router.put("/traveler-profile/:userId", (req, res) => {
    const userId = req.params.userId;
    const { fullName, email, phone, avatar, gender, recentTrips, dateOfBirth, preferredDestinations, travelStyle, budget, accommodation, transport, languages } = req.body;

    const profileQuery = `
        INSERT INTO traveler_profile (user_id, fullName, email, phone, avatar, gender, recentTrips, dateOfBirth, preferredDestinations, travelStyle, budget, accommodation, transport, languages)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            fullName = VALUES(fullName), email = VALUES(email), phone = VALUES(phone), avatar = VALUES(avatar), 
            gender = VALUES(gender), recentTrips = VALUES(recentTrips), dateOfBirth = VALUES(dateOfBirth), 
            preferredDestinations = VALUES(preferredDestinations), travelStyle = VALUES(travelStyle), 
            budget = VALUES(budget), accommodation = VALUES(accommodation), 
            transport = VALUES(transport), languages = VALUES(languages);
    `;

    db.query(profileQuery, [userId, fullName, email, phone, avatar, gender, recentTrips, dateOfBirth, preferredDestinations, travelStyle, budget, accommodation, transport, languages], (err) => {
        if (err) return res.status(500).json({ error: "Database update error", details: err });

        // ✅ Update register_data table (Email & Phone)
        const registerDataQuery = `UPDATE register_data SET email = ?, phone = ? WHERE id = ?;`;

        db.query(registerDataQuery, [email, phone, userId], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update register_data", details: err });

            res.json({ message: "Traveler profile updated successfully!", updatedProfile: req.body });
        });
    });
});

// ✅ Get guide profile
router.get("/guide-profile/:userId", (req, res) => {
    const userId = req.params.userId;
    const query = "SELECT * FROM guide_profile WHERE user_id = ?";

    db.query(query, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });
        if (result.length === 0) return res.status(404).json({ message: "Guide profile not found" });
        res.json(result[0]);
    });
});

// Insert/Update guide profile
router.put("/guide-profile/:userId", (req, res) => {
    const userId = req.params.userId;
    const { fullName, email, phone, experience, specializedDestinations, languagesSpoken, certifications, availability, avatar, gender, recentTrips } = req.body;

    const profileQuery = `
        INSERT INTO guide_profile (user_id, fullName, email, phone, experience, specializedDestinations, languagesSpoken, certifications, availability, avatar, gender, recentTrips)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            fullName = VALUES(fullName), email = VALUES(email), phone = VALUES(phone), experience = VALUES(experience), 
            specializedDestinations = VALUES(specializedDestinations), languagesSpoken = VALUES(languagesSpoken), 
            certifications = VALUES(certifications), availability = VALUES(availability), 
            avatar = VALUES(avatar), gender = VALUES(gender), recentTrips = VALUES(recentTrips);
    `;

    db.query(profileQuery, [userId, fullName, email, phone, experience, specializedDestinations, languagesSpoken, certifications, availability, avatar, gender, recentTrips], (err) => {
        if (err) return res.status(500).json({ error: "Database update error", details: err });

        // Update register_data table (Email & Phone)
        const registerDataQuery = `UPDATE register_data SET email = ?, phone = ? WHERE id = ?;`;

        db.query(registerDataQuery, [email, phone, userId], (err) => {
            if (err) return res.status(500).json({ error: "Failed to update register_data", details: err });

            res.json({ message: "Guide profile updated successfully!", updatedProfile: req.body });
        });
    });
});

module.exports = router;
