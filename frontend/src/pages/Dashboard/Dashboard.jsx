import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IconMic, IconStop, IconCpu } from '../../components/Icons';
import './Dashboard.css';
import API_BASE from '../../apiConfig';
import { motion } from "motion/react"

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recordings, setRecordings] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [summary, setSummary] = useState('');
    const [processingAudio, setProcessingAudio] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [recordingName, setRecordingName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:5000/api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('No se pudo obtener la información del usuario');
                }

                const data = await response.json();
                setUserData(data);

                // Cargar grabaciones previas del usuario
                const recordingsResponse = await fetch('http://localhost:5000/api/recordings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (recordingsResponse.ok) {
                    const recordingsData = await recordingsResponse.json();
                    setRecordings(recordingsData);
                }
            } catch (err) {
                console.error('Error:', err);
                setError('Error al cargar los datos del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = e => {
                chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioChunks([]);
            };

            setMediaRecorder(recorder);
            setAudioChunks(chunks);
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Error al iniciar la grabación:', err);
            setError('No se pudo acceder al micrófono');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleProcessAudio = async () => {
        if (!audioBlob) {
            setError('Por favor grabe audio');
            return;
        }

        setProcessingAudio(true);
        setError('');
        setTranscription('');
        setSummary('');

        try {
            const formData = new FormData();
            formData.append('audioFile', audioBlob);

            // 1. Subir audio
            const uploadResponse = await fetch(`${API_BASE}/recordings/upload`, {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('Error al subir el audio');
            }

            const uploadData = await uploadResponse.json();
            const uploadedFileName = uploadData.uri.split('/').pop();
            const summaryFileName = `resumen-${uploadedFileName}.txt`;

            // 2. Esperar hasta que el resumen esté listo (polling)
            const waitForFinalize = async (filename, retries = 10, delay = 3000) => {
                for (let i = 0; i < retries; i++) {
                    const res = await fetch(`${API_BASE}/recordings/finalize`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(filename)
                    });

                    if (res.ok) {
                        const result = await res.json();
                        return result;
                    }

                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                throw new Error('❌ El resumen no estuvo listo a tiempo.');
            };

            // 3. Ejecutar finalize con espera
            const resultData = await waitForFinalize(summaryFileName);
            console.log('✅ Grabación finalizada:', resultData.message);

            // Mostrar automáticamente el resumen
            setSummary(resultData.summary || 'No se pudo obtener el resumen.');
            setTranscription("Transcripción disponible en el archivo de GCS."); // opcional


            // 4. Refrescar la lista de grabaciones
            const token = localStorage.getItem('token');
            const recordingsResponse = await fetch(`${API_BASE}/recordings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (recordingsResponse.ok) {
                const recordingsData = await recordingsResponse.json();
                setRecordings(recordingsData);
            }

            setAudioBlob(null);
            setRecordingName('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al procesar el audio. Intenta nuevamente.');
        } finally {
            setProcessingAudio(false);
        }
    };



    const handleViewRecording = async (recordingId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/recordings/${recordingId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo obtener la grabación');
            }

            const data = await response.json();
            setTranscription(data.transcription);
            setSummary(data.summary);
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar la grabación');
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <div className="dashboard-page">
            <Container>
                <h1 className="mb-4">Dashboard</h1>
                {error && <Alert variant="danger">{error}</Alert>}

                <Row>
                    <Col md={8}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h3>Nueva Consulta Médica</h3>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre de la consulta</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={recordingName}
                                        onChange={(e) => setRecordingName(e.target.value)}
                                        placeholder="Ej: Consulta Paciente Juan Pérez - 25/07/2025"
                                        required
                                    />
                                </Form.Group>

                                <div className="recording-controls mb-4">
                                    {!isRecording ? (
                                        <motion.button
                                            className="btn btn-primary"
                                            onClick={handleStartRecording}
                                            disabled={processingAudio}
                                            whileHover={{ scale : 1.05}}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ type : "spring", stiffness: 300}}
                                        >
                                            <span className="me-2"><IconMic /></span>
                                            Iniciar Grabación
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            className="btn btn-danger recording-btn"
                                            onClick={handleStopRecording}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <span className="me-2"><IconStop /></span>
                                            Detener Grabación
                                        </motion.button>
                                    )}

                                    {audioBlob && !isRecording && (
                                        <motion.button
                                            className="btn btn-success ms-3"
                                            onClick={handleProcessAudio}
                                            disabled={processingAudio || !recordingName}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {processingAudio ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="me-2"><IconCpu /></span>
                                                    Procesar Audio
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </div>

                                {audioBlob && !isRecording && (
                                    <div className="audio-preview mb-3">
                                        <h5>Vista previa del audio:</h5>
                                        <audio
                                            controls
                                            src={URL.createObjectURL(audioBlob)}
                                            className="w-100"
                                        />
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        {(transcription || summary) && (
                            <Row>
                                <Col md={12}>
                                    <Card className="mb-4">
                                        <Card.Header>
                                            <h3>Transcripción</h3>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="transcription-content">
                                                {transcription || 'No hay transcripción disponible'}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={12}>
                                    <Card className="mb-4">
                                        <Card.Header>
                                            <h3>Resumen de la Consulta</h3>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="summary-content">
                                                {summary || 'No hay resumen disponible'}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </Col>

                    <Col md={4}>
                        <Card>
                            <Card.Header>
                                <h3>Consultas Previas</h3>
                            </Card.Header>
                            <Card.Body>
                                {recordings.length === 0 ? (
                                    <p>No hay consultas previas</p>
                                ) : (
                                    <div className="recordings-list">
                                        {recordings.map(recording => (
                                            <div key={recording._id} className="recording-item">
                                                <div className="recording-info">
                                                    <h5>{recording.name}</h5>
                                                    <p className="text-muted">
                                                        {new Date(recording.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleViewRecording(recording._id)}
                                                >
                                                    Ver
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;