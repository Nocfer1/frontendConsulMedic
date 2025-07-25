import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Verifica si viene de la página de prueba gratuita
    const isFromFreeTrial = location.state?.fromFreeTrial;
    const redirectPath = location.state?.from?.pathname || (isFromFreeTrial ? '/free-trial-setup' : '/dashboard');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        console.log('Intentando iniciar sesión con:', email);

        try {
            const result = await login(email, password);
            console.log('Resultado del login:', result);

            if (result.success) {
                console.log('Login exitoso, redirigiendo a:', redirectPath);
                // Establecemos un timeout para asegurarnos que el estado se actualice
                setTimeout(() => {
                    navigate(redirectPath, { replace: true });
                }, 100);
            } else {
                setError(result.error || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
            }
        } catch (err) {
            console.error('Error en login:', err);
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