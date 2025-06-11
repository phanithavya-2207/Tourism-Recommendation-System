import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/GuideBookings.scss";

const GuideBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/guide-bookings/${user.id}`);
                setBookings(response.data);
            } catch (err) {
                console.error("Error fetching guide bookings:", err);
                setError("Failed to load bookings.");
            } finally {
                setLoading(false);
            }
        };

        if (user.id) {
            fetchBookings();
        }
    }, [user.id]);

    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p>{error}</p>;
    if (bookings.length === 0) return <p>No bookings found.</p>;

    return (
        <div className="guide-bookings">
            <h2>My Bookings</h2>
            <table>
                <thead>
                    <tr>
                        <th>Traveler</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Destination</th>
                        <th>Place</th>
                        <th>Duration</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.booking_id}>
                            <td>{booking.traveler_name}</td>
                            <td>{booking.traveler_email}</td>
                            <td>{booking.traveler_phone}</td>
                            <td>{booking.destination_name}</td>
                            <td>{booking.place_name}</td>
                            <td>{booking.stay_duration} days</td>
                            <td>{booking.booking_date}</td>
                            <td>${booking.amount}</td>
                            <td className={booking.booking_status.toLowerCase()}>{booking.booking_status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GuideBookings;