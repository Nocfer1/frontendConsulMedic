import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const NuevaConsulta = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');

    const handleStartRecording = () => {
        setIsRecording(true);
        // Aquí irá la lógica de grabación
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        // Aquí irá la lógica para detener la grabación
    };

    return (
        <div className="main-content">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <h2 className="text-center mb-4">Nueva Consulta Médica</h2>
                        <div className="recording-section">
                            <div className="text-center mb-4">
                                <Button
                                    variant={isRecording ? "danger" : "success"}
                                    className="recording-button"
                                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                                >
                                    {isRecording ? "⬛" : "🎤"}
                                </Button>
                                <p className="mt-3 text-light">
                                    {isRecording ? "Grabando..." : "Presiona para iniciar la grabación"}
                                </p>
                            </div>

                            <div className="transcription-box">
                                {transcription ? (
                                    <>
                                        <h5 className="mb-3">Transcripción:</h5>
                                        <p className="text-light">{transcription}</p>
                                    </>
                                ) : (
                                    <p className="text-center text-muted">
                                        La transcripción aparecerá aquí cuando finalices la grabación...
                                    </p>
                                )}
                            </div>

                            {transcription && (
                                <div className="text-center mt-4">
                                    <Button variant="success" className="btn-success-custom">
                                        Generar Resumen IA
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default NuevaConsulta;
