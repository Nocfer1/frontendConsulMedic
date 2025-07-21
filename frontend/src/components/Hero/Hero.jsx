import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import './Hero.css';
import consulta_medica from '../../assets/consulta_medica.png';

const Hero = () => {
    const navigate = useNavigate(); // Inicializamos el hook

    // Función para manejar el click del botón
    const handleStartNow = () => {
        navigate('/register'); // Redirige al registro
    };

    return (
        <div className="hero-section">
            <Container>
                <Row className="align-items-center min-vh-100">
                    <Col md={6} className="text-center text-md-start">
                        <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInUp">
                            Aplicación para transcribir consultas médicas
                        </h1>
                        <div className="features-container">
                            <div className="feature-card animate__animated animate__fadeInUp animate__delay-1s">
                                <h3>Transcripción automática</h3>
                                <p>Convierte audio de una consulta médica a texto de forma fácil y rápida</p>
                            </div>
                            <div className="feature-card animate__animated animate__fadeInUp animate__delay-2s">
                                <h3>Resúmenes instantáneos</h3>
                                <p>Obtén un resumen inteligente de cada consulta</p>
                            </div>
                            <div className="feature-card animate__animated animate__fadeInUp animate__delay-3s">
                                <h3>Rapidez en consultas</h3>
                                <p>Reduce el tiempo y mejora la eficiencia en tus consultas medicas</p>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            className="mt-4 animate__animated animate__fadeInUp animate__delay-3s"
                            onClick={handleStartNow} // Agregamos el manejador de eventos
                        >
                            Comenzar ahora
                        </Button>
                    </Col>
                    <Col md={6} className="d-none d-md-block">
                        <div className="hero-image animate__animated animate__fadeIn">
                            <img src={consulta_medica} alt="Consultorio médico" className="img-fluid" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Hero;