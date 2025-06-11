import React, { useState, useEffect } from "react";
import "../styles/Aboutus.scss";

const AboutUs = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        "https://clubmahindra.gumlet.io/blog/images/Kerala-resized2.jpg?w=376&dpr=2.6",
        "https://holidays.tripfactory.com/blogs/wp-content/uploads/sites/6/2024/04/Mauritius-An-Indian-Ocean-Paradise-1024x576.webp",
        "https://www.thegrandindianroute.com/wp-content/uploads/2024/02/blog136-1-scaled-3.webp"
    ];

    const moveSlide = (index) => {
        if (index < 0) {
            setCurrentIndex(images.length - 1);
        } else if (index >= images.length) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(index);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            moveSlide(currentIndex + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className="about-us">
            <header>Welcome to Tourism Explorer</header>

            <div className="welcome-text">
                <p>Discover breathtaking destinations, serene landscapes, and adventure-filled getaways with Tourism Explorer. Our advanced travel recommendation system helps you plan the perfect trip tailored to your preferences!</p>
            </div>

            <div className="slider-container">
                <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {images.map((img, index) => (
                        <div key={index} className="item" style={{ backgroundImage: `url(${img})` }}></div>
                    ))}
                </div>
                <button id="prev" onClick={() => moveSlide(currentIndex - 1)}>&#10094;</button>
                <button id="next" onClick={() => moveSlide(currentIndex + 1)}>&#10095;</button>
            </div>

            <div className="card-container">
                {[
                    { img: "https://clubmahindra.gumlet.io/blog/images/Kerala-resized2.jpg?w=376&dpr=2.6", title: "Beautiful Destination" },
                    { img: "https://images.indianexpress.com/2017/05/summer-thinkstock_7591.jpg?w=414", title: "Peaceful Retreat" },
                    { img: "https://images.indianexpress.com/2017/05/summer-thinkstock_7591.jpg?w=414", title: "Exotic Adventure" },
                    { img: "https://www.holidify.com/images/bgImages/KERALA.jpg", title: "Serene Waterfalls" }
                ].map((card, index) => (
                    <div key={index} className="card">
                        <img src={card.img} alt={card.title} />
                        <h3>{card.title}</h3>
                    </div>
                ))}
            </div>

            <div className="description">
                <h2>How Our Travel Recommendation System Works</h2>
                <p>Our travel recommendation system analyzes your interests, budget, and preferred climate to suggest the best destinations for your next trip. Whether you're looking for adventure, relaxation, or cultural experiences, our system curates personalized itineraries for you.</p>
            </div>

            <div className="contact">
                <h3>Contact Us</h3>
                <p>Email: tourism@explorer.com | Phone: +1234567890</p>
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-whatsapp"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
        </div>
    );
};

export default AboutUs;
