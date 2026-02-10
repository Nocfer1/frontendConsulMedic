import React, { useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './FreeTrial.css';

const FreeTrialSetup = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleStartTrial = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login', { state: { fromFreeTrial: true } });
                return;
            }

            // Iniciar prueba gratuita en el backend
            const response = await fetch('http://localhost:5000/api/user/start-trial', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al iniciar la prueba gratuita');
            }

            // Redirigir al dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al iniciar la prueba gratuita. Por favor, intenta nuevamente.');
        }
    };

    return (
        <div className="free-trial-page">
            <Container>
                <Card className="trial-card">
                    <Card.Body>
                        <h2 className="text-center mb-4">Prueba Gratuita - 14 días</h2>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <div className="trial-features">
                            <h4>Durante tu prueba gratuita tendrás acceso a:</h4>
                            <ul>
                                <li>Transcripción ilimitada de consultas</li>
                                <li>Generación de resúmenes automáticos</li>
                                <li>Análisis de datos básicos</li>
                                <li>Soporte técnico prioritario</li>
                            </ul>
                        </div>

                        <div className="trial-info">
                            <p>
                                Al finalizar el período de prueba, tu cuenta se convertirá
                                automáticamente en una suscripción del Plan Profesional por $49.99/mes,
                                a menos que canceles antes.
                            </p>
                        </div>

                        <Button
                            variant="primary"
                            size="lg"
                            className="w-100 mt-3"
                            onClick={handleStartTrial}
                        >
                            Comenzar Prueba Gratuita
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default FreeTrialSetup;