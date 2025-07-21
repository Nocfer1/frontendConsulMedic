import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Verifica si viene de la página de prueba gratuita
    const isFromFreeTrial = location.state?.fromFreeTrial;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Aquí irá la lógica de autenticación con tu backend
            console.log('Login:', { email, password });

            // Si el login es exitoso y viene de prueba gratuita
            if (isFromFreeTrial) {
                navigate('/free-trial-setup');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        }
    };

    return (
        <div className="auth-page">
            <Container>
                <div className="auth-content">
                    <Card className="auth-card">
                        <Card.Body>
                            <h2 className="text-center mb-4">
                                {isFromFreeTrial ? 'Inicia sesión para tu prueba gratuita' : 'Iniciar Sesión'}
                            </h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 mb-3">
                                    Iniciar Sesión
                                </Button>

                                <div className="text-center">
                                    <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                                </div>
                            </Form>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                        </Card.Footer>
                    </Card>
                </div>
            </Container>
        </div>
    );
};

export default Login;