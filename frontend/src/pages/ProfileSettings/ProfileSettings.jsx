import React from 'react';
import { Container, Card } from 'react-bootstrap';

const ProfileSettings = () => {
    return (
        <Container className="py-4">
            <Card>
                <Card.Header>
                    <h3>Preferencias</h3>
                </Card.Header>
                <Card.Body>
                    <p>Aquí podrás configurar tus preferencias futuras como idioma, notificaciones y más.</p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProfileSettings;
