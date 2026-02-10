import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './WritingSection.css';

const WritingSection = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <section className="writing-section">
            <Container>
                <Row className="align-items-center">
                    <Col lg={6} data-aos="fade-right">
                        <img
                            src="/doctor-laptop.jpg"
                            alt="Doctor usando laptop"
                            className="img-fluid rounded shadow"
                        />
                    </Col>
                    <Col lg={6} data-aos="fade-left">
                        <h2 className="section-title">¿Escribiendo mucho?</h2>
                        <p className="section-subtitle">
                            ConsulMedic - La solución de IA para transcribir audio a texto
                            más eficiente para profesionales médicos
                        </p>
                        <p className="section-description">
                            Basado en tecnología de aprendizaje profundo de última generación,
                            ofrecemos una solución integral para consultas médicas.
                            Transcribe tus consultas en segundos y genera resúmenes
                            automáticos en un entorno seguro basado en la nube.
                        </p>
                    </Col>
                </Row>
                <Row className="stats-container mt-5">
                </Row>
            </Container>
        </section>
    );
};

export default WritingSection;