import React, { useEffect, useState } from "react";

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [places, setPlaces] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/destinations")
            .then((response) => response.json())
            .then((data) => setDestinations(data))
            .catch((error) => console.error("Error fetching destinations:", error));
    }, []);

    const handleDestinationClick = (destination) => {
        if (selectedDestination?.destination_id === destination.destination_id) {
            setSelectedDestination(null);
            setPlaces([]);
            return;
        }

        fetch(`http://localhost:5000/api/places/${destination.destination_id}`)
            .then((response) => response.json())
            .then((data) => {
                setPlaces(data);
                setSelectedDestination(destination);
            })
            .catch((error) => console.error("Error fetching places:", error));
    };

    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: "#044d30", // Background color changed
                minHeight: "100vh",
            }}
        >
            <h2 style={{ textAlign: "center", fontSize: "28px", marginBottom: "20px", color: "white" }}>
                Famous Destinations in India
            </h2>

            <div
                className="destination-container"
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    justifyContent: selectedDestination ? "flex-start" : "center",
                }}
            >
                <div
                    className="destination-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: selectedDestination ? "1fr" : "repeat(4, minmax(120px, 1fr))",
                        gap: "12px",
                        flex: selectedDestination ? "0.5" : "1",
                        transition: "0.3s ease-in-out",
                    }}
                >
                    {destinations.map((destination) => (
                        <div
                            key={destination.destination_id}
                            className="destination-card"
                            onClick={() => handleDestinationClick(destination)}
                            style={{
                                backgroundImage: `url(${destination.image_url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: "10px",
                                padding: "10px",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "180px",
                                cursor: "pointer",
                                textAlign: "center",
                                fontWeight: "bold",
                                textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
                                flex: selectedDestination ? "0.3" : "1",
                                transition: "0.3s ease-in-out",
                            }}
                        >
                            <h3 style={{ fontSize: "16px" }}>{destination.destination_name}</h3>
                        </div>
                    ))}
                </div>

                {selectedDestination && (
                    <div
                        className="places-dialog"
                        style={{
                            flex: "0.7",
                            padding: "15px",
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            backgroundColor: "#ffffff",
                            minHeight: "250px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h3 style={{ marginBottom: "10px", color: "#333" }}>{selectedDestination.destination_name}</h3>
                        <p style={{ fontSize: "14px", color: "#555", marginBottom: "15px" }}>
                            {selectedDestination.description}
                        </p>

                        <input
                            type="text"
                            placeholder="Search places..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: "8px",
                                width: "100%",
                                marginBottom: "12px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                            }}
                        />

                        {places
                            ?.filter((place) =>
                                place.place_name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((place, index) => (
                                <div
                                    key={place.place_id}
                                    className="place-card"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                                        marginBottom: "10px",
                                        padding: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        backgroundColor: "#ffffff",
                                    }}
                                >
                                    <video
                                        src={place.image_url} // Video URL from database
                                        controls
                                        autoPlay
                                        loop
                                        style={{
                                            width: "200px",
                                            height: "150px",
                                            borderRadius: "6px",
                                            margin: index % 2 === 0 ? "0 10px 0 0" : "0 0 0 10px",
                                        }}
                                    ></video>
                                    <div>
                                        <h4>{place.place_name}</h4>
                                        <p style={{ fontSize: "12px", margin: "0" }}>{place.description}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Destinations;
