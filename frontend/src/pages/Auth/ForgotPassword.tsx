import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Aquí irá la llamada a tu API para enviar el correo de recuperación
            // Por ejemplo:
            // await api.sendPasswordResetEmail(email);

            // Simulamos una llamada a la API
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsSubmitted(true);
        } catch (err) {
            setError('No se pudo enviar el correo de recuperación. Por favor, intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Container>
                <div className="auth-content">
                    <Card className="auth-card">
                        <Card.Body>
                            <h2 className="text-center mb-4">Recuperar Contraseña</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {isSubmitted ? (
                                <div className="text-center">
                                    <Alert variant="success">
                                        Hemos enviado un correo con las instrucciones para recuperar tu contraseña.
                                        Por favor, revisa tu bandeja de entrada.
                                    </Alert>
                                    <Link to="/login" className="btn btn-primary mt-3">
                                        Volver al inicio de sesión
                                    </Link>
                                </div>
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            placeholder="Ingresa tu correo electrónico"
                                        />
                                        <Form.Text className="text-muted">
                                            Te enviaremos un correo con las instrucciones para recuperar tu contraseña.
                                        </Form.Text>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 mb-3"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Enviando...' : 'Enviar Correo de Recuperación'}
                                    </Button>

                                    <div className="text-center">
                                        <Link to="/login">Volver al inicio de sesión</Link>
                                    </div>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </div>
    );
};

export default ForgotPassword;