import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

const Header = () => {
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);

    return (
        <Navbar expanded={expanded} expand="lg" variant="dark" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/">ConsulMedic</Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="navbar-nav"
                    onClick={() => setExpanded(!expanded)}
                />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link
                            as={Link}
                            to="/"
                            className={location.pathname === "/" ? "active" : ""}
                            onClick={() => setExpanded(false)}
                        >
                            Inicio
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/consulta"
                            className={location.pathname === "/consulta" ? "active" : ""}
                            onClick={() => setExpanded(false)}
                        >
                            Nueva Consulta
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/historial"
                            className={location.pathname === "/historial" ? "active" : ""}
                            onClick={() => setExpanded(false)}
                        >
                            Historial
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/about"
                            className={location.pathname === "/about" ? "active" : ""}
                            onClick={() => setExpanded(false)}
                        >
                            Sobre Nosotros
                        </Nav.Link>
                    </Nav>
                    <Link to="/login" className="btn btn-success-custom">
                        Iniciar Sesión
                    </Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
