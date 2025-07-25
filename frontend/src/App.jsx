import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import './App.css';
import NavigationBar from './components/Navbar/Navbar';
import DashboardNavbar from './components/Navbar/DashboardNavbar';
import Hero from './components/Hero/Hero';
import WritingSection from './components/WritingSection/WritingSection';
import DemoSection from './components/DemoSection/DemoSection';
import WhyChooseUs from './components/WhyChooseUs/WhyChooseUs';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer/Footer';
import Pricing from './pages/Pricing/Pricing';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import FreeTrialSetup from './pages/FreeTrial/FreeTrialSetup';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import Profile from './pages/UserProfile/Profile';
import Consultations from './pages/Consultations/Consultations';
import { AuthProvider } from './context/AuthContext';

const AppContent = () => {
    const location = useLocation();
    const [isDashboardPath, setIsDashboardPath] = useState(false);

    useEffect(() => {
        const dashboardPaths = [
            '/dashboard', 
            '/consultations', 
            '/profile',
            '/free-trial-setup'
        ];

        setIsDashboardPath(dashboardPaths.some(path => 
            location.pathname.startsWith(path)));
    }, [location]);

    return (
        <div className="App">
            {isDashboardPath ? <DashboardNavbar /> : <NavigationBar />}
            <div className="main-content">
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={
                        <>
                            <Hero />
                            <WritingSection />
                            <DemoSection />
                            <WhyChooseUs />
                            <FAQ />
                        </>
                    } />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Rutas protegidas */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/free-trial-setup" element={<FreeTrialSetup />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/consultations" element={<Consultations />} />
                    </Route>
                </Routes>
            </div>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;