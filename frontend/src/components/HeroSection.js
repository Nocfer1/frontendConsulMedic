import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <div className="hero-section">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <h1>Optimiza tus consultas médicas</h1>
                        <ul className="list-unstyled feature-list d-inline-block text-start mx-auto">
                            <li>
                                <span className="feature-icon">🎙️</span>
                                Transcripción automática de consultas
                            </li>
                            <li>
                                <span className="feature-icon">🤖</span>
                                Resúmenes generados por IA
                            </li>
                            <li>
                                <span className="feature-icon">⏱️</span>
                                Ahorra tiempo en documentación
                            </li>
                        </ul>
                        <div>
                            <Link to="/consulta" className="btn btn-success-custom mt-4">
                                Iniciar Nueva Consulta
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HeroSection;
