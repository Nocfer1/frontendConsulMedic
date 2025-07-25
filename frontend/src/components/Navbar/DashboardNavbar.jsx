import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconHeart, IconDashboard, IconJournal, IconUser, IconGear, IconLogout } from '../../components/Icons';
import './Navbar.css';

const DashboardNavbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="dashboard-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard">
                    <span className="me-2"><IconHeart /></span>
                    ConsulMedic
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/dashboard">
                            <span className="me-1"><IconDashboard /></span> Dashboard
                        </Nav.Link>
                        <Nav.Link as={Link} to="/consultations">
                            <span className="me-1"><IconJournal /></span> Mis Consultas
                        </Nav.Link>
                        <Nav.Link as={Link} to="/profile">
                            <span className="me-1"><IconUser /></span> Perfil
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {currentUser && (
                            <NavDropdown 
                                title={
                                    <span>
                                        <span className="me-1"><IconUser /></span>
                                        {currentUser.nombre || 'Usuario'}
                                    </span>
                                } 
                                id="user-dropdown"
                            >
                                <NavDropdown.Item as={Link} to="/profile">
                                    <span className="me-2"><IconGear /></span>
                                    Configuración
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    <span className="me-2"><IconLogout /></span>
                                    Cerrar Sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default DashboardNavbar;
