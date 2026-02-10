import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
    const navigate = useNavigate();

    const handleFreeTrial = () => {
        navigate('/free-trial-setup');
    };

    const plans = [
        {
            name: "Prueba Gratuita",
            price: "GRATIS",
            billing: "No es necesaria tarjeta de crédito",
            features: [
                "20 transcripciones/mes",
                "Soporte por correo electrónico estándar",
                "Plantillas de notas predeterminadas"
            ],
            buttonText: "Comenzar",
            isPopular: false,
            class: "free",
            buttonVariant: "primary"
        },
        {
            name: "Esencial",
            price: "$39",
            billing: "$ 399 facturados anualmente",
            features: [
                "150 transcripciones/mes",
                "Soporte prioritario por correo electrónico",
                "Plantillas de notas personalizadas",
                "Soporte telefónico"
            ],
            buttonText: "Comenzar",
            isPopular: false,
            class: "essential"
        },
        {
            name: "Profesional",
            price: "$59",
            billing: "$ 599 facturados anualmente",
            features: [
                "300 transcripciones/mes",
                "Soporte prioritario por correo electrónico",
                "Plantillas de notas personalizadas",
                "Soporte telefónico"
            ],
            buttonText: "Comenzar",
            isPopular: true,
            class: "professional"
        },
        {
            name: "Premium",
            price: "$89",
            billing: "$ 899 facturados anualmente",
            features: [
                "Transcripciones ilimitadas",
                "Soporte prioritario por correo electrónico",
                "Soporte telefónico",
                "Soporte de incorporación 1:1",
                "Plantillas de notas personalizadas"
            ],
            buttonText: "Comenzar",
            isPopular: false,
            class: "premium"
        }
    ];

    const comparisonFeatures = [
        { name: "Transcripciones/mes", free: "20", essential: "150", professional: "300", premium: "Ilimitado" },
        { name: "Soporte por correo electrónico estándar", free: true, essential: true, professional: true, premium: true },
        { name: "Plantillas de notas personalizadas", free: true, essential: true, professional: true, premium: true },
        { name: "Soporte prioritario por correo electrónico", free: false, essential: true, professional: true, premium: true },
        { name: "Soporte telefónico", free: false, essential: false, professional: true, premium: true },
        { name: "Soporte de incorporación 1:1", free: false, essential: false, professional: false, premium: true }
    ];

    return (
        <div className="pricing-page">
            <Container>
                <div className="pricing-header text-center">
                    <h1>Planes de precios</h1>
                    <h2>Encuentra el paquete adecuado</h2>
                    <p>Mejore su experiencia de transcripción médica a un precio que se ajuste a su presupuesto.</p>
                </div>

                <Row className="pricing-cards">
                    {plans.map((plan, index) => (
                        <Col key={index} lg={3} md={6}>
                            <Card className={`pricing-card ${plan.class} ${plan.isPopular ? 'popular' : ''}`}>
                                {plan.isPopular && <div className="popular-badge">Más Popular</div>}
                                <Card.Body>
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <div className="price">
                                        <span className="amount">{plan.price}</span>
                                        <span className="period">/mes</span>
                                    </div>
                                    <p className="billing">{plan.billing}</p>
                                    <ul className="features-list">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx}>
                                                <i className="bi bi-check-circle-fill"></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        variant={plan.buttonVariant || "primary"}
                                        className="w-100"
                                        onClick={plan.name === "Prueba Gratuita" ? handleFreeTrial : undefined}
                                    >
                                        {plan.buttonText}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className="comparison-section">
                    <h3>Compare los planes</h3>
                    <div className="table-responsive">
                        <Table className="comparison-table">
                            <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Prueba Gratuita</th>
                                <th>Esencial</th>
                                <th>Profesional</th>
                                <th>Premium</th>
                            </tr>
                            </thead>
                            <tbody>
                            {comparisonFeatures.map((feature, index) => (
                                <tr key={index}>
                                    <td>{feature.name}</td>
                                    <td>{typeof feature.free === 'boolean' ?
                                        (feature.free ? <i className="bi bi-check-circle-fill text-success"></i> : '-') :
                                        feature.free}
                                    </td>
                                    <td>{typeof feature.essential === 'boolean' ?
                                        (feature.essential ? <i className="bi bi-check-circle-fill text-success"></i> : '-') :
                                        feature.essential}
                                    </td>
                                    <td>{typeof feature.professional === 'boolean' ?
                                        (feature.professional ? <i className="bi bi-check-circle-fill text-success"></i> : '-') :
                                        feature.professional}
                                    </td>
                                    <td>{typeof feature.premium === 'boolean' ?
                                        (feature.premium ? <i className="bi bi-check-circle-fill text-success"></i> : '-') :
                                        feature.premium}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Pricing;