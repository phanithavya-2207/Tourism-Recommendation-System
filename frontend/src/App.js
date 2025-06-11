import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy load components to improve performance
const Register = lazy(() => import("./components/Register"));
const GuideBookings = lazy(() => import("./components/GuideBookings"));
const Feedback = lazy(() => import("./components/Feedback"));
const TravelerBookings = lazy(() => import("./components/TravelerBookings"));
const Login = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Profile = lazy(() => import("./components/Profile"));
const GuideProfile = lazy(() => import("./components/GuideProfile"));
const FAQ = lazy(() => import("./components/FAQ"));
const Destinations = lazy(() => import("./components/Destinations"));
const Aboutus = lazy(() => import("./components/Aboutus"));
const PlanTrip = lazy(() => import("./components/PlanTrip"));
const Recommendations = lazy(() => import("./components/Recommendations")); // ✅ Added Recommendations Page

function App() {
    const userId = 1; // Replace with dynamic user ID from auth state

    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/guide-profile" element={<GuideProfile />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/destinations" element={<Destinations />} />
                    <Route path="/aboutus" element={<Aboutus />} />
                    <Route path="/plan-trip" element={<PlanTrip />} />
                    <Route path="/guide-bookings" element={<GuideBookings />} />
                    <Route path="/traveler-bookings" element={<TravelerBookings />} />
                    <Route path="/recommendations" element={<Recommendations userId={userId} />} /> {/* ✅ Added Route */}
                    <Route path="*" element={<Login />} /> {/* Fallback Route */}
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
