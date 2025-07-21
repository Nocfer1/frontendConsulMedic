import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <p>&copy; {new Date().getFullYear()} ConsultApp</p>
                <p>Transformando la atención médica con tecnología</p>
            </Container>
        </footer>
    );
};

export default Footer;
