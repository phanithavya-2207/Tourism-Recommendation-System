import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Weather from "./Weather"; // Import Weather component
import "../styles/Dashboard.scss";

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const navigate = useNavigate();
    
    const [showSidebar, setShowSidebar] = useState(false);
    const [guides, setGuides] = useState([]);
    const [places, setPlaces] = useState([]);
    const [placesLoading, setPlacesLoading] = useState(false);
    const [guidesLoading, setGuidesLoading] = useState(false);
    const [placesError, setPlacesError] = useState(null);
    const [guidesError, setGuidesError] = useState(null);
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        setCurrentDate(formattedDate);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const fetchGuides = async () => {
        if (!user?.id) return;
        setGuidesLoading(true);
        setGuidesError(null);

        try {
            const res = await axios.get(`http://localhost:5000/api/recommend-guides/${user.id}`);
            setGuides(res.data);
        } catch (err) {
            console.error("Error fetching guides:", err);
            setGuidesError("No guides found.");
        } finally {
            setGuidesLoading(false);
        }
    };

    const fetchPlaces = async () => {
        if (!user?.id) return;
        setPlacesLoading(true);
        setPlacesError(null);

        try {
            const res = await axios.get(`http://localhost:5000/api/recommend-places/${user.id}`);
            setPlaces(res.data);
        } catch (err) {
            console.error("Error fetching places:", err);
            setPlacesError("No places found.");
        } finally {
            setPlacesLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, [user?.id]);

    return (
        <div className="dashboard-container">
            <header>
                <div className="left-side">
                    <Weather /> 
                    <p className="date-display">{currentDate}</p>
                </div>
                <h1>Tour Travel</h1>
                <nav>
                    <ul>
                        <li><a href="/Dashboard">Home</a></li>
                        <li><a href="/Aboutus">About Us</a></li>
                        <li><a href="/destinations">Destination</a></li>
                        <li>
                            <a href={user?.user_type === "traveler" ? "/profile" : "/guide-profile"}>
                                Profile
                            </a>
                        </li>
                        <li><a href="/feedback">Feedback</a></li>
                        <li><a href="/FAQ">FAQ</a></li>
                    </ul>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </nav>
            </header>

            <section className="hero">
                <h2>Welcome, {user?.username || "Guest"}!</h2>
                <p>
                    {user?.user_type === "traveler"
                        ? "Find the best destinations and plan your next adventure."
                        : "Manage your tours and assist travelers in discovering new places."}
                </p>
                <div className="hero-buttons">
                    {user?.user_type === "traveler" ? (
                        <>
                            <button className="primary" onClick={() => navigate("/destinations")}>Explore Destinations</button>
                            <button className="secondary" onClick={() => navigate("/plan-trip")}>Plan Your Trip</button>
                            <button className="secondary" onClick={() => {
                                setShowSidebar(true);
                                fetchGuides();
                            }}>Guides</button>
                            <button className="secondary" onClick={() => navigate("/traveler-bookings")}>
                                View My Bookings
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="primary" onClick={() => navigate("/manage-tours")}>Manage My Tours</button>
                            <button className="secondary" onClick={() => navigate("/guide-bookings")}>
                                View Bookings
                            </button>
                        </>
                    )}
                </div>
            </section>

            <section className="features">
                {placesLoading ? (
                    <p>Loading places...</p>
                ) : placesError ? (
                    <p>{placesError}</p>
                ) : places.length > 0 ? (
                    places.map((place) => (
                        <div key={place.id} className="feature-card" onClick={() => window.open(place.image_url, "_blank")}> 
                            <img src={place.image} alt={place.name} className="place-image" />
                            <h3>{place.place_name}</h3>
                            <p>{place.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No places available.</p>
                )}
            </section>

            <div className={`sidebar ${showSidebar ? "active" : ""}`}>
                <button className="close-btn" onClick={() => setShowSidebar(false)}>X</button>
                <h2>Recommended Guides</h2>
                {guidesLoading ? <p>Loading guides...</p> : guidesError ? <p>{guidesError}</p> : (
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
                            <p>No guides available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
