import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PlanTrip.scss";

const PlanTrip = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || {};

    const [destinations, setDestinations] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState("");
    const [places, setPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState("");
    const [accommodations, setAccommodations] = useState([]);
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [trains, setTrains] = useState([]);
    const [flights, setFlights] = useState([]);
    const [selectedTransport, setSelectedTransport] = useState(null);
    const [guides, setGuides] = useState([]);
    const [searchGuide, setSearchGuide] = useState("");
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [showBookingDialog, setShowBookingDialog] = useState(false);
    const [stayDuration, setStayDuration] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:5000/api/destinations")
            .then(response => setDestinations(response.data))
            .catch(error => console.error("Error fetching destinations:", error));

        axios.get("http://localhost:5000/api/guides")
            .then(response => setGuides(response.data))
            .catch(error => console.error("Error fetching guides:", error));
    }, []);

    const handleDestinationChange = async (e) => {
        const destinationId = e.target.value;
        setSelectedDestination(destinationId);
        setSelectedPlace("");
        setAccommodations([]);
        setTrains([]);
        setFlights([]);
        setSelectedAccommodation(null);
        setSelectedTransport(null);

        if (destinationId) {
            try {
                const response = await axios.get(`http://localhost:5000/api/places/${destinationId}`);
                setPlaces(response.data);
            } catch (error) {
                console.error("Error fetching places:", error);
            }
        } else {
            setPlaces([]);
        }
    };

    const handlePlaceChange = async (e) => {
        const placeId = e.target.value;
        setSelectedPlace(placeId);
        setAccommodations([]);
        setTrains([]);
        setFlights([]);
        setSelectedAccommodation(null);
        setSelectedTransport(null);

        if (placeId) {
            try {
                const [accomResponse, trainResponse, flightResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/api/accommodations/${placeId}`),
                    axios.get(`http://localhost:5000/api/trains/${placeId}`),
                    axios.get(`http://localhost:5000/api/flights/${placeId}`)
                ]);

                setAccommodations(accomResponse.data);
                setTrains(trainResponse.data);
                setFlights(flightResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };

    const calculateTotalPrice = () => {
        let total = 0;
        if (selectedAccommodation) {
            total += selectedAccommodation.price_per_night * stayDuration;
        }
        if (selectedTransport) {
            total += selectedTransport.price;
        }
        if (selectedGuide) {
            total += 12000;
        }
        setTotalPrice(total);
    };

    const handleProceedToBooking = () => {
        calculateTotalPrice();
        setShowBookingDialog(true);
    };

    const handleCloseDialog = () => {
        setShowBookingDialog(false);
    };

    const handleBooking = async () => {
        if (!selectedDestination || !selectedPlace || !selectedAccommodation || !selectedTransport) {
            alert("Please select all required options before booking.");
            return;
        }

        if (!user?.id) {
            alert("User not found. Please log in again.");
            return;
        }

        const bookingDetails = {
            user_id: user.id, // Using logged-in user's ID dynamically
            destination_id: selectedDestination,
            place_id: selectedPlace,
            accommodation_id: selectedAccommodation?.hotel_id || null,
            transportation_id: selectedTransport?.train_id || selectedTransport?.flight_id || null,
            stay_duration: stayDuration,
            amount: totalPrice,
            booking_status: "Confirmed",
            guide_id: selectedGuide ? selectedGuide.id : null, // Include guide if selected
        };

        try {
            const response = await axios.post("http://localhost:5000/api/bookings", bookingDetails);
            alert(`Booking Successful! Booking ID: ${response.data.bookingId}, Amount Paid: ₹${totalPrice}`);
            setShowBookingDialog(false);
        } catch (error) {
            console.error("Error making booking:", error.response?.data || error);
            alert("Failed to confirm booking. Please try again.");
        }
    };
    
    return (
        <div className="plan-trip-container">
            <h1>Plan Your Trip</h1>

            <div className="trip-options">
                <div className="option">
                    <h3>Select a Destination</h3>
                    <select value={selectedDestination} onChange={handleDestinationChange}>
                        <option value="">-- Choose a destination --</option>
                        {destinations.map(dest => (
                            <option key={dest.destination_id} value={dest.destination_id}>
                                {dest.destination_name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedDestination && (
                    <div className="option">
                        <h3>Select a Place</h3>
                        <select value={selectedPlace} onChange={handlePlaceChange}>
                            <option value="">-- Choose a place --</option>
                            {places.map(place => (
                                <option key={place.place_id} value={place.place_id}>
                                    {place.place_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {selectedPlace && (
                <>
                    <h2>Available Accommodations</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Hotel Name</th>
                                <th>Rating</th>
                                <th>Price Per Night</th>
                                <th>Facilities</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accommodations.map(accom => (
                                <tr key={accom.hotel_id}>
                                    <td><img src={accom.image_url} alt={accom.hotel_name} className="hotel-image" /></td>
                                    <td>{accom.hotel_name}</td>
                                    <td>{accom.rating} ⭐</td>
                                    <td>₹{accom.price_per_night}</td>
                                    <td>{accom.facilities}</td>
                                    <td><button onClick={() => setSelectedAccommodation(accom)}>Select</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2>Available Flights</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Airline</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map(flight => (
                                <tr key={flight.flight_id}>
                                    <td>{flight.from_airport}</td>
                                    <td>{flight.to_airport}</td>
                                    <td>{flight.airline}</td>
                                    <td>{flight.departure_time}</td>
                                    <td>{flight.arrival_time}</td>
                                    <td>₹{flight.price}</td>
                                    <td>{flight.duration}</td>
                                    <td><button onClick={() => setSelectedTransport(flight)}>Select</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h2>Available Trains</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Train Name</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trains.map(train => (
                                <tr key={train.train_id}>
                                    <td>{train.from_place}</td>
                                    <td>{train.to_place}</td>
                                    <td>{train.train_name}</td>
                                    <td>{train.departure_time}</td>
                                    <td>{train.arrival_time}</td>
                                    <td>₹{train.price}</td>
                                    <td>{train.duration}</td>
                                    <td><button onClick={() => setSelectedTransport(train)}>Select</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </>
            )}

                
           <div className="guide-section">
                <h2>Available Guides</h2>
                <input
                    type="text"
                    placeholder="Search Guide..."
                    value={searchGuide}
                    onChange={(e) => setSearchGuide(e.target.value)}
                />
                <div className="guides">
                    {guides.filter(guide => guide.fullName.toLowerCase().includes(searchGuide.toLowerCase()))
                        .map(guide => (
                            <div key={guide.id} className="guide-item">
                                <img src={guide.avatar} alt={guide.fullName} />
                                <div className="details">
                                    <h3>{guide.fullName}</h3>
                                    <p>Email: {guide.email}</p>
                                    <p>Phone: {guide.phone}</p>
                                    <button onClick={() => setSelectedGuide(guide)}>Select</button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>




            <h2>Summary</h2>
            <p><strong>Destination:</strong> {selectedDestination}</p>
            <p><strong>Place:</strong> {selectedPlace}</p>
            <p><strong>Accommodation:</strong> {selectedAccommodation?.hotel_name}</p>
            <p><strong>Transportation:</strong> {selectedTransport?.train_name || selectedTransport?.airline}</p>
            <p><strong>Guide:</strong> {selectedGuide?.fullName}</p>
            <label>Number of Days to Stay: </label>
                        <input
                            type="number"
                            min="1"
                            value={stayDuration}
                            onChange={(e) => setStayDuration(Number(e.target.value))}
                        />

                        <br />
            {selectedDestination && selectedPlace && selectedAccommodation && selectedTransport && (
                <button className="proceed-btn" onClick={handleProceedToBooking}>
                    Proceed to Booking
                </button>
            )}

            {showBookingDialog && (
                <div className="booking-dialog">
                    <div className="dialog-content">
                        <h2>Confirm Your Trip</h2>
                        <p><strong>Total Price:</strong> ₹{totalPrice}</p>
                        
                        <button onClick={handleBooking}>
                Confirm Booking & Pay
            </button>
                        <button onClick={handleCloseDialog}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanTrip;
