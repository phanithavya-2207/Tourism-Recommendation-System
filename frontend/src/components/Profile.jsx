import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../styles/Profile.scss";

const avatarOptions = [
    "https://img.freepik.com/free-vector/blond-man-with-eyeglasses-icon-isolated_24911-100831.jpg?t=st=1740579514~exp=1740583114~hmac=f5459113d4ecefe3d39954eb35e8635bdf4c23bbce1a14a85816746a54c04434&w=1060",
    "https://img.freepik.com/premium-photo/profile-icon-white-background_941097-160810.jpg?ga=GA1.1.1092778822.1739814628&semt=ais_hybrid",
    "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?ga=GA1.1.1092778822.1739814628&semt=ais_hybrid",
    "https://img.freepik.com/premium-photo/profile-icon-white-background_941097-162486.jpg?ga=GA1.1.1092778822.1739814628&semt=ais_hybrid",
    "https://img.freepik.com/premium-vector/portrait-pretty-young-woman_684058-1153.jpg?ga=GA1.1.1092778822.1739814628&semt=ais_hybrid",
    "https://img.freepik.com/premium-vector/portrait-caucasian-woman-avatar-female-person-vector-icon-adult-flat-style-headshot_605517-26.jpg?ga=GA1.1.1092778822.1739814628&semt=ais_hybrid",
    "https://img.freepik.com/premium-vector/women-avatar_1272837-52.jpg?ga=GA1.1.1092778822.1739814628&semt=ais_hybrid",
    "https://img.freepik.com/premium-vector/avatar-portrait-young-caucasian-woman-round-frame-vector-cartoon-flat-illustration_551425-22.jpg?ga=GA1.1.1092778822.1739814628&semt=ais_hybrid"

];

const Profile = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id || null;
    const [profile, setProfile] = useState({});
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:5000/api/traveler-profile/${userId}`)
                .then((res) => setProfile(res.data))
                .catch((err) => console.error("Error fetching profile:", err));
        }
    }, [userId]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAvatarSelect = (avatar) => {
        setProfile({ ...profile, avatar });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/api/traveler-profile/${userId}`, profile)
            .then((res) => {
                alert("Profile updated successfully!");
                setProfile(res.data.updatedProfile);
                setEditing(false);
            })
            .catch((err) => console.error("Error updating profile:", err));
    };

    return (
        <div className="profile-container">
            <h2>Welcome, {profile.fullName || "Traveler"}!</h2>

            <div className="profile-header">
                <img className="profile-avatar" src={profile.avatar || avatarOptions[0]} alt="User Avatar" />
            </div>

            {!editing ? (
                <div className="profile-details">
                    <p><strong>Full Name:</strong> {profile.fullName}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phone}</p>
                    <p><strong>Date of Birth:</strong> {profile.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {profile.gender}</p>
                    <p><strong>Preferred Destinations:</strong> {profile.preferredDestinations}</p>
                    <p><strong>Travel Style:</strong> {profile.travelStyle}</p>
                    <p><strong>Recent Trips:</strong> {profile.recentTrips}</p>
                    <p><strong>Budget:</strong> {profile.budget}</p>
                    <p><strong>Preferred Accommodation:</strong> {profile.accommodation}</p>
                    <p><strong>Preferred Transport:</strong> {profile.transport}</p>
                    <p><strong>Languages Spoken:</strong> {profile.languages}</p>
                    <button onClick={() => setEditing(true)}>Edit Profile</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="profile-form">
                    <label>Avatar:</label>
                    <div className="avatar-selection">
                        {avatarOptions.map((avatar, index) => (
                            <img
                                key={index}
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className={`avatar-option ${profile.avatar === avatar ? "selected" : ""}`}
                                onClick={() => handleAvatarSelect(avatar)}
                            />
                        ))}
                    </div>

                    <label>Full Name:</label>
                    <input type="text" name="fullName" value={profile.fullName || ""} onChange={handleChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={profile.email || ""} onChange={handleChange} required />

                    <label>Phone:</label>
                    <input type="tel" name="phone" value={profile.phone || ""} onChange={handleChange} required />

                    <label>Date of Birth:</label>
                    <input type="date" name="dateOfBirth" value={profile.dateOfBirth || ""} onChange={handleChange} required />

                    <label>Gender:</label>
                    <select name="gender" value={profile.gender || ""} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>Preferred Destinations:</label>
                    <select name="preferredDestinations" value={profile.preferredDestinations || ""} onChange={handleChange}>
                        <option value="">Select Destination</option>
                        <option value="Hill Stations">Hill Stations</option>
                        <option value="Beaches">Beaches</option>
                        <option value="Historical & Cultural Sites">Historical & Cultural Sites</option>
                        <option value="Pilgrimage & Spiritual Places">Pilgrimage & Spiritual Places</option>
                        <option value="Desert & Unique Landscapesg">Desert & Unique Landscapes</option>
                        <option value="Backwaters & Scenic Locations">Backwaters & Scenic Locations</option>
                        <option value="Trending">Trending</option>

                    </select>

                    <label>Travel Style:</label>
                    <select name="travelStyle" value={profile.travelStyle || ""} onChange={handleChange}>
                        <option value="">Select Travel Style</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Backpacking">Backpacking</option>
                        <option value="Family">Family</option>
                        <option value="Romantic">Romantic</option>
                    </select>

                    <label>Recent Trips:</label>
                    <input type="text" name="recentTrips" value={profile.recentTrips || ""} onChange={handleChange} />

                    <label>Budget:</label>
                    <select name="budget" value={profile.budget || ""} onChange={handleChange}>
                        <option value="">Select Budget</option>
                        <option value="Low-budget">Low-budget</option>
                        <option value="Mid-range">Mid-range</option>
                        <option value="Luxury">Luxury</option>
                    </select>

                    <label>Preferred Accommodation:</label>
                    <select name="accommodation" value={profile.accommodation || ""} onChange={handleChange}>
                        <option value="">Select Accommodation</option>
                        <option value="Hotels">Hotels</option>
                        <option value="Resorts">Resorts</option>
                        <option value="Hostels">Hostels</option>
                        <option value="Homestays">Homestays</option>
                        <option value="Airbnb">Airbnb</option>
                    </select>

                    <label>Preferred Transport:</label>
                    <select name="transport" value={profile.transport || ""} onChange={handleChange}>
                        <option value="">Select Transport</option>
                        <option value="Flights">Flights</option>
                        <option value="Trains">Trains</option>
                        <option value="Road Trips">Road Trips</option>
                        <option value="Cruises">Cruises</option>
                        <option value="Biking">Biking</option>
                    </select>

                    <label>Languages Spoken:</label>
                    <input type="text" name="languages" value={profile.languages || ""} onChange={handleChange} />

                    <button type="submit">Save Changes</button>
                </form>
            )}
        </div>
    );
};

export default Profile;