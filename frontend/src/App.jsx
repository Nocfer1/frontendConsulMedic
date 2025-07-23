import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css'; // Importamos los estilos de AOS
import './App.css';
import NavigationBar from './components/Navbar/Navbar';
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

function App() {
    return (
        <Router>
            <div className="App">
                <NavigationBar />
                <div className="main-content">
                    <Routes>
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
                        <Route path="/free-trial-setup" element={<FreeTrialSetup />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;