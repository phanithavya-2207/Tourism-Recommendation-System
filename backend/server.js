const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const cancelBooking = require("./routes/cancelBooking");
const profileRoutes = require("./routes/profileRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const destinationsRoutes = require("./routes/destinationsRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const trainRoutes = require("./routes/trainRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const flightRoutes = require("./routes/flightRoutes");
const faqRoutes = require("./routes/faqRoutes");
const guideRoutes = require("./routes/guideRoutes");
const placesRoutes = require("./routes/placesRoutes");  // Added this line

const database = require("./database");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", destinationsRoutes);
app.use("/api", accommodationRoutes);
app.use("/api", trainRoutes);
app.use("/api", flightRoutes);
app.use("/api", guideRoutes);
app.use("/api", recommendationRoutes);
app.use("/api", cancelBooking);
app.use("/api", faqRoutes);
app.use("/api", placesRoutes);  // Added this line

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
