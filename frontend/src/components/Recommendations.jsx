import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/Recommendations.scss"; // Ensure you have styling

const Recommendation = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id || null;
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:5000/api/recommend-guides/${userId}`)
                .then((res) => {
                    setGuides(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching guides:", err);
                    setError("No guides found.");
                    setLoading(false);
                });
        }
    }, [userId]);

    return (
        <div className="recommendation-container">
            <h2>Recommended Guides</h2>
            {loading && <p>Loading guides...</p>}
            {error && <p>{error}</p>}

            <div className="guide-list">
                {guides.length > 0 ? (
                    guides.map((guide) => (
                        <div key={guide.guide_id} className="guide-card">
                            <h3>{guide.fullName}</h3>
                            <p><strong>Languages:</strong> {guide.languagesSpoken}</p>
                            <p><strong>Specialized Destinations:</strong> {guide.specializedDestinations}</p>
                            <p><strong>Recent Trips:</strong> {guide.recentTrips}</p>
                        </div>
                    ))
                ) : (
                    !loading && <p>No guides available.</p>
                )}
            </div>
        </div>
    );
};

export default Recommendation;
