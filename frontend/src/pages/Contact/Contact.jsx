import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import './Contact.css';
import footer from "../../components/Footer/Footer";

const Contact = () => {
    return (
        <div className="contact-page">
            <Container>
                <div className="contact-content">
                    <h1 className="text-center mb-5">Contáctanos</h1>
                    <Form className="contact-form">
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese su nombre" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Ingrese su email" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Asunto</Form.Label>
                            <Form.Control type="text" placeholder="Asunto del mensaje" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mensaje</Form.Label>
                            <Form.Control as="textarea" rows={5} placeholder="Escriba su mensaje" />
                        </Form.Group>

                        <Button variant="primary" type="submit" size="lg" className="w-100">
                            Enviar Mensaje
                        </Button>
                    </Form>
                </div>
            </Container>
        </div>
    );
};

export default Contact;