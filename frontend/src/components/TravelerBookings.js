import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TravelerBookings.scss";

const TravelerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [reason, setReason] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBookings, setSelectedBookings] = useState([]);
    
    const user = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/traveler-bookings/${user.id}`);
                setBookings(response.data);
            } catch (err) {
                console.error("Error fetching traveler bookings:", err);
                setError("Failed to load bookings.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchBookings();
        }
    }, [user?.id]);

    const handleCheckboxChange = (bookingId) => {
        setSelectedBookings((prevSelected) => 
            prevSelected.includes(bookingId) 
                ? prevSelected.filter(id => id !== bookingId) 
                : [...prevSelected, bookingId]
        );
    };

    const openCancelDialog = (booking) => {
        setSelectedBooking(booking);
        setIsDialogOpen(true);
    };

    const handleConfirmCancellation = async () => {
        if (!selectedBooking || reason.trim() === "") {
            alert("Please provide a cancellation reason.");
            return;
        }

        const refundAmount = (selectedBooking.amount * 0.75).toFixed(2); // 75% refund

        try {
            const response = await axios.post("http://localhost:5000/api/cancel-booking", {
                userId: user.id,
                bookingId: selectedBooking.booking_id,
                reason,
                refundAmount
            });

            if (response.data.success) {
                alert("Booking successfully cancelled.");
                setBookings(bookings.map(booking => 
                    booking.booking_id === selectedBooking.booking_id 
                        ? { ...booking, booking_status: "Cancelled" } 
                        : booking
                ));
                setIsDialogOpen(false);
                setReason("");
                setSelectedBooking(null);
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert("Cancellation failed. Try again.");
        }
    };

    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p>{error}</p>;
    if (bookings.length === 0) return <p>No bookings found.</p>;

    return (
        <div className="traveler-bookings">
            <h2>My Bookings</h2>
            <button 
                className="cancel-btn" 
                onClick={() => selectedBookings.length > 0 && openCancelDialog(bookings.find(b => b.booking_id === selectedBookings[0]))}
                disabled={selectedBookings.length === 0}
            >
                Cancel Selected
            </button>
            
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Destination</th>
                        <th>Place</th>
                        <th>Duration</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Guide Name</th>
                        <th>Guide Email</th>
                        <th>Guide Phone</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.booking_id}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedBookings.includes(booking.booking_id)}
                                    onChange={() => handleCheckboxChange(booking.booking_id)}
                                />
                            </td>
                            <td>{booking.destination_name}</td>
                            <td>{booking.place_name}</td>
                            <td>{booking.stay_duration} days</td>
                            <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                            <td>${booking.amount}</td>
                            <td>{booking.guide_name || "No Guide Assigned"}</td>
                            <td>{booking.guide_email || "N/A"}</td>
                            <td>{booking.guide_phone || "N/A"}</td>
                            <td className={booking.booking_status.toLowerCase()}>{booking.booking_status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isDialogOpen && selectedBooking && (
                <div className="dialog">
                    <h3>Confirm Cancellation</h3>
                    <p>Enter reason for cancellation:</p>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
                    <p>Refund Amount: <strong>${(selectedBooking.amount * 0.75).toFixed(2)}</strong></p>
                    <button onClick={handleConfirmCancellation}>Confirm Cancellation</button>
                    <button onClick={() => setIsDialogOpen(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default TravelerBookings;
