import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    // Comprobamos si hay un usuario autenticado
    const isAuthenticated = !!currentUser;

    return isAuthenticated ?
        <Outlet /> :
        <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;