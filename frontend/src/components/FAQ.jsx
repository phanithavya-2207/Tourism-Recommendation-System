import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FAQ.scss";

const FAQPage = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswers, setNewAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        fetchFAQs();
    }, []);

    // ✅ Fetch FAQs from Backend
    const fetchFAQs = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/faqs");
            if (response.data.success) {
                setQuestions(response.data.questions);

                const answersGrouped = response.data.answers.reduce((acc, answer) => {
                    if (!acc[answer.question_id]) acc[answer.question_id] = [];
                    acc[answer.question_id].push(answer);
                    return acc;
                }, {});

                setAnswers(answersGrouped);
            }
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Add New Question
    const handleAddQuestion = async () => {
        if (!newQuestion.trim()) return alert("Please enter a question.");
        try {
            await axios.post("http://localhost:5000/api/faqs/add", { userId: user.id, question: newQuestion });
            setNewQuestion("");
            fetchFAQs();
        } catch (error) {
            console.error("Error adding question:", error);
        }
    };

    // ✅ Add Answer to a Question
    const handleAddAnswer = async (questionId) => {
        if (!newAnswers[questionId]?.trim()) return alert("Please enter an answer.");
        try {
            await axios.post("http://localhost:5000/api/faqs/answer", { questionId, userId: user.id, answer: newAnswers[questionId] });
            setNewAnswers({ ...newAnswers, [questionId]: "" });
            fetchFAQs();
        } catch (error) {
            console.error("Error adding answer:", error);
        }
    };

    if (loading) return <p>Loading FAQs...</p>;

    return (
        <div className="faq-container">
            <h2>FAQ Section</h2>

            {/* Add Question */}
            <div className="faq-form">
                <input
                    type="text"
                    placeholder="Ask a question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                />
                <button onClick={handleAddQuestion}>Submit</button>
            </div>

            {/* Display Questions & Answers */}
            {questions.length === 0 ? (
                <p>No questions yet. Be the first to ask!</p>
            ) : (
                questions.map((q) => (
                    <div key={q.question_id} className="faq-item">
                        <p><strong>{q.username}:</strong> {q.question}</p>
                        <div className="answers">
                            {answers[q.question_id]?.map((a) => (
                                <p key={a.answer_id}><strong>{a.username}:</strong> {a.answer}</p>
                            ))}
                        </div>
                        <div className="faq-answer-form">
                            <input
                                type="text"
                                placeholder="Write an answer..."
                                value={newAnswers[q.question_id] || ""}
                                onChange={(e) => setNewAnswers({ ...newAnswers, [q.question_id]: e.target.value })}
                            />
                            <button onClick={() => handleAddAnswer(q.question_id)}>Reply</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FAQPage;