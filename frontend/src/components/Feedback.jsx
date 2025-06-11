import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/Feedback.scss";

const FAQ = () => {
    const user = JSON.parse(localStorage.getItem("user")); // ✅ Get Logged-in User
    const [showDialog, setShowDialog] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [rating, setRating] = useState(5);
    const [file, setFile] = useState(null);
    const [feedbackList, setFeedbackList] = useState([]);
    const [showFeedbackList, setShowFeedbackList] = useState(false);

    // ✅ Fetch feedback from backend
    useEffect(() => {
        axios.get("http://localhost:5000/api/get-feedback")
            .then(response => setFeedbackList(response.data.feedback))
            .catch(error => console.error("Error fetching feedback:", error));
    }, []);

    // ✅ Submit feedback
    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in to submit feedback.");
            return;
        }

        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("username", user.username);
        formData.append("feedback_text", feedbackText);
        formData.append("rating", rating);
        if (file) formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/api/submit-feedback", formData);
            alert(response.data.message);
            setShowDialog(false);
            setFeedbackText("");
            setRating(5);
            setFile(null);

            // ✅ Refresh feedback list after submission
            const newFeedback = {
                username: user.username,
                feedback_text: feedbackText,
                rating,
            };
            setFeedbackList([...feedbackList, newFeedback]);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Error submitting feedback");
        }
    };

    return (
        <div className="faq-container">
            <h2>FAQs & Feedback</h2>
            <div className="faq-actions">
                <button onClick={() => setShowDialog(true)}>Give Feedback</button>
                <button onClick={() => setShowFeedbackList(!showFeedbackList)}>
                    {showFeedbackList ? "Hide Feedback" : "View Feedback"}
                </button>
            </div>

            {/* ✅ Display All Feedback from Users */}
            {showFeedbackList && (
                <div className="feedback-list">
                    <h3>User Feedback</h3>
                    {feedbackList.length > 0 ? (
                        feedbackList.map((feedback, index) => (
                            <div key={index} className="feedback-card">
                                <p><strong>{feedback.username}:</strong> {feedback.feedback_text}</p>
                                <p>Rating: {"⭐".repeat(feedback.rating)}</p>
                            </div>
                        ))
                    ) : (
                        <p>No feedback available yet.</p>
                    )}
                </div>
            )}

            {/* ✅ Feedback Dialog Box */}
            {showDialog && (
                <div className="feedback-dialog">
                    <h3>Submit Your Feedback</h3>
                    <form onSubmit={handleSubmitFeedback}>
                        <p><strong>Username:</strong> {user?.username || "Guest"}</p>
                        <textarea
                            placeholder="Write your feedback..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            required
                        />
                        <label>Rating:</label>
                        <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value="5">⭐⭐⭐⭐⭐</option>
                            <option value="4">⭐⭐⭐⭐</option>
                            <option value="3">⭐⭐⭐</option>
                            <option value="2">⭐⭐</option>
                            <option value="1">⭐</option>
                        </select>
                        <label>Upload File:</label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => setShowDialog(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FAQ;