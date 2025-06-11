import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Recommendations.scss';

const RecommendedPlaces = ({ userId }) => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/recommendations/${userId}`)
            .then(response => setPlaces(response.data))
            .catch(error => console.error("Error fetching recommendations:", error));
    }, [userId]);

    return (
        <div className="recommendations-container">
            <h2>Recommended Places</h2>
            {places.length === 0 ? (
                <p>No recommendations available.</p>
            ) : (
                <ul>
                    {places.map((place, index) => (
                        <li key={index} className="recommendation-item">
                            <img src={place.image_url} alt={place.place_name} />
                            <h3>{place.place_name}</h3>
                            <p>{place.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecommendedPlaces;
