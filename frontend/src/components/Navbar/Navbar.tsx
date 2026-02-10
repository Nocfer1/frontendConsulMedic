import React, { useState, useEffect } from 'react';
import { Leaf, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-content">
                <div className="brand">
                    <Leaf color="var(--sage)" size={24} />
                    <span>MedScribe AI</span>
                </div>
                <div className="nav-links">
                    <a className="nav-link">Nuestra Filosofía</a>
                    <a className="nav-link">La Experiencia</a>
                    <button className="btn btn-primary">
                        Solicitar Demo
                    </button>
                </div>
                <button className="mobile-menu-btn">
                    <Menu color="var(--moss)" size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;