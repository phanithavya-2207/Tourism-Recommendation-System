const express = require("express");
const router = express.Router();
const db = require("../database");
const multer = require("multer");

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in an uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Save feedback
router.post("/submit-feedback", upload.single("file"), (req, res) => {
    const { user_id, username, feedback_text, rating } = req.body;
    const file_path = req.file ? req.file.path : null;

    if (!user_id || !username || !feedback_text || !rating) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const sql = "INSERT INTO feedback (user_id, username, feedback_text, rating, file_path) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [user_id, username, feedback_text, rating, file_path], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Error saving feedback" });

        res.json({ success: true, message: "Feedback submitted successfully" });
    });
});

// Get feedback list
router.get("/get-feedback", (req, res) => {
    db.query("SELECT * FROM feedback ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Error retrieving feedback" });

        res.json({ success: true, feedback: results });
    });
});

module.exports = router;
