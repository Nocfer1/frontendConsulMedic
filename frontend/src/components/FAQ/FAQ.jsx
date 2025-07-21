import React, { useState } from 'react';
import { Container, Accordion } from 'react-bootstrap';
import './FAQ.css';

const FAQ = () => {
    const faqs = [
        {
            question: "¿Qué es ConsulMedic?",
            answer: "ConsulMedic es una plataforma de transcripción médica basada en IA que convierte automáticamente el audio de las consultas médicas en texto, permitiendo a los profesionales de la salud centrarse más en sus pacientes."
        },
        {
            question: "¿Cómo funciona ConsulMedic?",
            answer: "Simplemente grabe su consulta o cargue un archivo de audio, y nuestra IA transcribirá automáticamente el contenido, generando un documento editable con formato médico profesional."
        },
        {
            question: "¿Mis datos están seguros y privados?",
            answer: "Sí, ConsulMedic cumple con HIPAA y utiliza encriptación de nivel bancario para proteger toda la información médica. Sus datos están seguros y son completamente confidenciales."
        },
        {
            question: "¿Puedo usar ConsulMedic en cualquier dispositivo?",
            answer: "Sí, ConsulMedic funciona en cualquier dispositivo con conexión a internet: computadoras, tablets y teléfonos móviles."
        }
    ];

    return (
        <section className="faq-section">
            <Container>
                <h2 className="text-center mb-5" data-aos="fade-up">
                    Preguntas Frecuentes
                </h2>
                <div className="faq-container" data-aos="fade-up">
                    <Accordion>
                        {faqs.map((faq, index) => (
                            <Accordion.Item eventKey={index} key={index}>
                                <Accordion.Header>{faq.question}</Accordion.Header>
                                <Accordion.Body>{faq.answer}</Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            </Container>
        </section>
    );
};

export default FAQ;