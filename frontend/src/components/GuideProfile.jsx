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

const GuideProfile = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id || null;
    const [profile, setProfile] = useState({});
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:5000/api/guide-profile/${userId}`)
                .then((res) => {
                    setProfile(res.data || {});
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching profile:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
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
        axios.put(`http://localhost:5000/api/guide-profile/${userId}`, profile)
            .then((res) => {
                alert("Profile updated successfully!");
                setProfile(res.data.updatedProfile || profile); // Ensure UI updates
                setEditing(false);
            })
            .catch((err) => console.error("Error updating profile:", err));
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-container">
            <h2>Welcome, {profile?.fullName || "Guide"}!</h2> 

            <div className="profile-header">
                <img className="profile-avatar" src={profile?.avatar || avatarOptions[0]} alt="Guide Avatar" />
            </div>

            {!editing ? (
                <div className="profile-details">
                    <p><strong>Full Name:</strong> {profile?.fullName }</p>
                    <p><strong>Email:</strong> {profile?.email }</p>
                    <p><strong>Phone:</strong> {profile?.phone }</p>
                    <p><strong>Gender:</strong> {profile?.gender }</p>
                    <p><strong>Experience (Years):</strong> {profile?.experience}</p>
                    <p><strong>Specialized Destinations:</strong> {profile?.specializedDestinations }</p>
                    <p><strong>Languages Spoken:</strong> {profile?.languagesSpoken }</p>
                    <p><strong>Availability:</strong> {profile?.availability }</p>
                    <p><strong>Recent Trips:</strong> {profile?.recentTrips }</p>
                    <p><strong>Certifications:</strong> {profile?.certifications }</p>
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
                                className={`avatar-option ${profile?.avatar === avatar ? "selected" : ""}`}
                                onClick={() => handleAvatarSelect(avatar)}
                            />
                        ))}
                    </div>

                    <label>Full Name:</label>
                    <input type="text" name="fullName" value={profile?.fullName || ""} onChange={handleChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={profile?.email || ""} onChange={handleChange} required />

                    <label>Phone:</label>
                    <input type="tel" name="phone" value={profile?.phone || ""} onChange={handleChange} required />

                    <label>Gender:</label>
                    <select name="gender" value={profile?.gender || ""} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>Experience (Years):</label>
                    <input type="number" name="experience" value={profile?.experience || ""} onChange={handleChange} required />

                    <label>Specialized Destinations:</label>
                    <input type="text" name="specializedDestinations" value={profile?.specializedDestinations || ""} onChange={handleChange} />

                    <label>Languages Spoken:</label>
                    <input type="text" name="languagesSpoken" value={profile?.languagesSpoken || ""} onChange={handleChange} />

                    <label>Availability:</label>
                    <select name="availability" value={profile?.availability || ""} onChange={handleChange}>
                        <option value="">Select Availability</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Seasonal">Seasonal</option>
                    </select>

                    <label>Recent Trips:</label>
                    <input type="text" name="recentTrips" value={profile?.recentTrips || ""} onChange={handleChange} />

                    <label>Certifications:</label>
                    <input type="text" name="certifications" value={profile?.certifications || ""} onChange={handleChange} />

                    <button type="submit">Save Changes</button>
                </form>
            )}
        </div>
    );
};

export default GuideProfile;
