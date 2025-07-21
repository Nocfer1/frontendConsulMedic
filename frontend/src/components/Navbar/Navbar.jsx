import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './Navbar.css';
import logo from '../../assets/logo.png';

const NavigationBar = () => {
    return (
        <Navbar bg="white" expand="lg" fixed="top" className="custom-navbar">
            <Navbar.Brand href="/" className="ms-4">
                <img
                    src={logo}
                    height="30"
                    className="d-inline-block align-top"
                    alt="ConsulMedic logo"
                /> ConsulMedic
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto me-4">
                    <Nav.Link href="#pricing">Precios</Nav.Link>
                    <Nav.Link href="#contact">Contacto</Nav.Link>
                    <Nav.Link href="#sobre-nosotros">Sobre nosotros</Nav.Link>
                    <Button variant="outline-primary" className="me-2">Prueba Gratis</Button>
                    <Button variant="primary">Registrarse</Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;