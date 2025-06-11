const express = require("express");
const router = express.Router();
const db = require("../database");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 25 * 1000; // 25 seconds
const CODE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

// Store verification codes temporarily
const verificationCodes = new Map();

// User Registration
router.post("/register", async (req, res) => {
    const { username, email, phone, password, user_type } = req.body;

    if (!username || !email || !phone || !password || !user_type) {
        return res.json({ success: false, message: "All fields are required" });
    }

    const checkSql = "SELECT * FROM Register_data WHERE username = ? OR email = ? OR phone = ?";
    db.query(checkSql, [username, email, phone], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        if (results.length > 0) {
            return res.json({ success: false, message: "Username, email, or phone already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertSql =
            "INSERT INTO Register_data (username, email, phone, password, user_type, failed_attempts, account_locked_until) VALUES (?, ?, ?, ?, ?, 0, NULL)";

        db.query(insertSql, [username, email, phone, hashedPassword, user_type], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Error registering user" });

            res.json({ success: true, message: "User registered successfully" });
        });
    });
});

// User Login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ success: false, message: "Username and password are required" });
    }

    const sql = "SELECT * FROM Register_data WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        if (results.length === 0) {
            return res.json({ success: false, message: "Username does not exist. Please register." });
        }

        const user = results[0];

        if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
            return res.json({ success: false, message: `Account is temporarily locked. Try again after 25 seconds.` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            let newAttempts = user.failed_attempts + 1;
            let lockUntil = null;

            if (newAttempts >= MAX_ATTEMPTS) {
                lockUntil = new Date(Date.now() + LOCK_TIME);
            }

            db.query(
                "UPDATE Register_data SET failed_attempts = ?, account_locked_until = ? WHERE username = ?",
                [newAttempts, lockUntil, username]
            );

            return res.json({ success: false, message: "Invalid credentials. Try again." });
        }

        db.query("UPDATE Register_data SET failed_attempts = 0, account_locked_until = NULL WHERE username = ?", [username]);

        res.json({
            success: true,
            message: "Login successful",
            user: { id: user.id, username: user.username, user_type: user.user_type },
        });
    });
});

// Forgot Password - Request Verification Code
router.post("/forgot-password", (req, res) => {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
        return res.json({ success: false, message: "Email or phone number is required" });
    }

    const sql = "SELECT * FROM Register_data WHERE email = ? OR phone = ?";
    db.query(sql, [emailOrPhone, emailOrPhone], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        if (results.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }

        const verificationCode = crypto.randomInt(100000, 999999).toString();
        verificationCodes.set(emailOrPhone, {
            code: verificationCode,
            expiresAt: Date.now() + CODE_EXPIRY_TIME,
        });

        console.log(`Verification Code for ${emailOrPhone}: ${verificationCode}`);

        res.json({ success: true, message: "Verification code sent" });
    });
});

// Verify Code & Reset Password
router.post("/reset-password", async (req, res) => {
    const { emailOrPhone, verificationCode, newPassword } = req.body;

    if (!emailOrPhone || !verificationCode || !newPassword) {
        return res.json({ success: false, message: "All fields are required" });
    }

    const storedCodeData = verificationCodes.get(emailOrPhone);
    if (!storedCodeData || storedCodeData.expiresAt < Date.now() || storedCodeData.code !== verificationCode) {
        return res.json({ success: false, message: "Invalid or expired verification code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const sql = "UPDATE Register_data SET password = ? WHERE email = ? OR phone = ?";

    db.query(sql, [hashedPassword, emailOrPhone, emailOrPhone], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Error resetting password" });

        verificationCodes.delete(emailOrPhone);
        res.json({ success: true, message: "Password reset successful" });
    });
});

module.exports = router;
