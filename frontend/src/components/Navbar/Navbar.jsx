import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';

const NavigationBar = () => {
    const navigate = useNavigate();

    return (
        <Navbar bg="white" expand="lg" fixed="top" className="custom-navbar">
            <Navbar.Brand as={Link} to="/" className="ms-4">
                <img
                    src={logo}
                    height="30"
                    className="d-inline-block align-top"
                    alt="ConsulMedic logo"
                />ConsulMedic
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto me-4">
                    <Nav.Link as={Link} to="/pricing">Precios</Nav.Link>
                    <Nav.Link as={Link} to="/contact">Contacto</Nav.Link>
                    <Nav.Link as={Link} to="/about">Sobre nosotros</Nav.Link>
                    <Button
                        variant="primary"
                        as={Link}
                        to="/register"
                    >
                        Registrarse
                    </Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;