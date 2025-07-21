import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './Pricing.css';

const Pricing = () => {
    return (
        <div className="pricing-page">
            <Container>
                <h1 className="text-center mb-5">Planes y Precios</h1>
                <Row>
                    <Col md={4}>
                        <Card className="pricing-card">
                            <Card.Header>
                                <h3>Plan Básico</h3>
                            </Card.Header>
                            <Card.Body>
                                <h2 className="price">$29.99<span>/mes</span></h2>
                                <ul className="features-list">
                                    <li>Hasta 50 transcripciones</li>
                                    <li>Resúmenes básicos</li>
                                    <li>Soporte por email</li>
                                </ul>
                                <Button variant="outline-primary" size="lg" block>
                                    Seleccionar Plan
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="pricing-card featured">
                            <Card.Header>
                                <h3>Plan Profesional</h3>
                                <span className="badge bg-primary">Más Popular</span>
                            </Card.Header>
                            <Card.Body>
                                <h2 className="price">$49.99<span>/mes</span></h2>
                                <ul className="features-list">
                                    <li>Transcripciones ilimitadas</li>
                                    <li>Resúmenes avanzados</li>
                                    <li>Soporte prioritario</li>
                                    <li>Análisis de datos</li>
                                </ul>
                                <Button variant="outline-primary" size="lg" block>
                                    Seleccionar Plan
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="pricing-card">
                            <Card.Header>
                                <h3>Plan Empresarial</h3>
                            </Card.Header>
                            <Card.Body>
                                <h2 className="price">$99.99<span>/mes</span></h2>
                                <ul className="features-list">
                                    <li>Todo lo del plan Profesional</li>
                                    <li>API personalizada</li>
                                    <li>Soporte 24/7</li>
                                    <li>Personalización completa</li>
                                </ul>
                                <Button variant="outline-primary" size="lg" block>
                                    Seleccionar Plan
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Pricing;