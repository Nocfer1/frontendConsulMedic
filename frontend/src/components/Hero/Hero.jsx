import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import consulta_medica from '../../assets/consulta_medica.png';

const Hero = () => {
    const navigate = useNavigate();
    const handleStartNow = () => navigate('/register');

    return (
        <section className="hero-section">
            {/* Fondo con desenfoque */}
            <div className="hero-bg" style={{ backgroundImage: `url(${consulta_medica})` }} />
            {/* Overlay para contraste */}
            <div className="hero-overlay" />

            <Container className="hero-content">
                <Row className="align-items-center">
                    <Col lg={7}>
                        <h1 className="display-3 fw-bold mb-4">
                            Aplicación para transcribir <br /> consultas médicas
                        </h1>

                        <div className="features-container">
                            <div className="feature-card">
                                <h3>Transcripción automática</h3>
                                <p>Convierte audio de una consulta médica a texto de forma fácil y rápida</p>
                            </div>
                            <div className="feature-card">
                                <h3>Resúmenes instantáneos</h3>
                                <p>Obtén un resumen inteligente de cada consulta</p>
                            </div>
                            <div className="feature-card">
                                <h3>Rapidez en consultas</h3>
                                <p>Reduce el tiempo y mejora la eficiencia en tus consultas médicas</p>
                            </div>
                        </div>

                        <Button variant="primary" size="lg" className="mt-4" onClick={handleStartNow}>
                            Comenzar ahora
                        </Button>
                    </Col>

                    {/* Foto “al medio” sutil (opcional): una tarjeta translúcida centrada */}
                    <Col lg={5} className="d-none d-lg-block">
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Hero;
