import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <Container>
                <h1 className="text-center mb-5">Sobre Nosotros</h1>
                <Row className="align-items-center">
                    <Col md={6}>
                        <div className="about-content">
                            <h2>Nuestra Misión</h2>
                            <p>
                                Facilitar el trabajo de los profesionales médicos a través de
                                tecnología innovadora que permita una gestión más eficiente
                                de las consultas médicas.
                            </p>
                            <h2>Nuestra Visión</h2>
                            <p>
                                Ser líderes en la transformación digital del sector salud,
                                mejorando la calidad de atención médica a través de
                                soluciones tecnológicas avanzadas.
                            </p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="about-image">
                            <img src="/about-image.jpg" alt="Equipo médico" className="img-fluid" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default About;