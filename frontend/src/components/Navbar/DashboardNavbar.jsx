import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap';
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

    // Tomamos el plan del usuario; ajusta estos campos si tu objeto difiere
    const planName = currentUser?.planName || currentUser?.plan || 'Gratis';

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="dashboard-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/dashboard" className="navitem-icon">
                    <IconHeart size={22} weight="fill" />
                    <span>ConsulMedic</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav" className="align-items-center">
                    {/* NAV CENTRAL 100% CENTRADO EN ESCRITORIO */}
                    <Nav className="center align-items-center">
                        <Nav.Link as={Link} to="/dashboard" className="navitem-icon">
                            <IconDashboard size={20} />
                            <span>Dashboard</span>
                        </Nav.Link>

                        <Nav.Link as={Link} to="/consultations" className="navitem-icon">
                            <IconJournal size={20} />
                            <span>Mis Consultas</span>
                        </Nav.Link>

                        {/* Mi Plan, al lado de Mis Consultas */}
                        <Nav.Link as={Link} to="/plan" className="navitem-icon">
                            <span>Mi plan</span>
                            <Badge bg="light" text="dark" className="ms-2">{planName}</Badge>
                        </Nav.Link>
                    </Nav>

                    {/* NAV DERECHA (usuario) */}
                    <Nav className="ms-lg-auto align-items-center">
                        {currentUser && (
                            <NavDropdown
                                align="end"
                                id="user-dropdown"
                                title={
                                    <span className="navitem-icon">
                    <IconUser size={20} />
                    <span>{currentUser.nombre || 'Usuario'}</span>
                  </span>
                                }
                            >
                                <NavDropdown.Item as={Link} to="/profile" className="navitem-icon">
                                    <IconGear size={18} />
                                    <span>Configuración</span>
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout} className="navitem-icon">
                                    <IconLogout size={18} />
                                    <span>Cerrar sesión</span>
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
