const express = require("express");
const router = express.Router();
const db = require("../database");

// API to cancel booking
router.post("/cancel-booking", async (req, res) => {
    const { userId, bookingId, reason, refundAmount } = req.body;

    try {
        // Insert cancellation details into cancelled_details table
        await db.query(
            "INSERT INTO cancelled_details (user_id, booking_id, reason, refund_amount) VALUES (?, ?, ?, ?)",
            [userId, bookingId, reason, refundAmount]
        );

        // Update booking status to 'Cancelled'
        await db.query(
            "UPDATE bookings SET booking_status = 'Cancelled' WHERE booking_id = ?",
            [bookingId]
        );

        res.json({ success: true, message: "Booking cancelled successfully." });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ success: false, message: "Cancellation failed." });
    }
});

module.exports = router;
