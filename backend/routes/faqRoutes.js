const express = require("express");
const router = express.Router();
const db = require("../database"); // Import MySQL database connection

// ✅ Fetch all FAQ questions along with answers
router.get("/faqs", async (req, res) => {
    try {
        const [questions] = await db.query(`
            SELECT fq.id AS question_id, fq.user_id, fq.question, fq.created_at, rd.username 
            FROM faq_questions fq 
            JOIN register_data rd ON fq.user_id = rd.id
            ORDER BY fq.created_at DESC
        `);

        const [answers] = await db.query(`
            SELECT fa.id AS answer_id, fa.question_id, fa.user_id, fa.answer, fa.created_at, rd.username 
            FROM faq_answers fa
            JOIN register_data rd ON fa.user_id = rd.id
            ORDER BY fa.created_at ASC
        `);

        res.json({ success: true, questions, answers });
    } catch (error) {
        console.error("❌ Error fetching FAQs:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch FAQs.", error: error.message });
    }
});

// ✅ Add a new question
router.post("/faqs/add", async (req, res) => {
    const { userId, question } = req.body;
    try {
        await db.query("INSERT INTO faq_questions (user_id, question) VALUES (?, ?)", [userId, question]);
        res.json({ success: true, message: "Question added successfully." });
    } catch (error) {
        console.error("❌ Error adding question:", error.message);
        res.status(500).json({ success: false, message: "Failed to add question." });
    }
});

// ✅ Add an answer to a question
router.post("/faqs/answer", async (req, res) => {
    const { questionId, userId, answer } = req.body;
    try {
        await db.query("INSERT INTO faq_answers (question_id, user_id, answer) VALUES (?, ?, ?)", [questionId, userId, answer]);
        res.json({ success: true, message: "Answer added successfully." });
    } catch (error) {
        console.error("❌ Error adding answer:", error.message);
        res.status(500).json({ success: false, message: "Failed to add answer." });
    }
});

module.exports = router;