import React from 'react';
import { Container } from 'react-bootstrap';
import './Footer.css';


const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <div className="footer-content">
                    <div className="footer-left">
                        <span>© 2025 ConsulMedic</span>
                    </div>
                    <div className="footer-right">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                            <i className="bi bi-instagram"></i>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                            <i className="bi bi-facebook"></i>
                        </a>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;