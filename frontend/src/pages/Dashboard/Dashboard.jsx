import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner, Badge, ProgressBar, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IconMic, IconStop, IconCpu} from '../../components/Icons';
import './Dashboard.css';
import AOS from 'aos';

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
        // Inicializar animaciones AOS
        AOS.init({
            duration: 800,
            once: true
        });

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
        if (!audioBlob || !recordingName) {
            setError('Por favor grabe audio y asigne un nombre a la consulta');
            return;
        }

        setProcessingAudio(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('audioFile', audioBlob);
            formData.append('name', recordingName);

            const response = await fetch('http://localhost:5000/api/recordings/transcribe', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al procesar el audio');
            }

            const data = await response.json();
            setTranscription(data.transcription);
            setSummary(data.summary);

            // Actualizar la lista de grabaciones
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

            setRecordingName('');
            setAudioBlob(null);
        } catch (err) {
            console.error('Error:', err);
            setError('Error al procesar el audio. Por favor, intente nuevamente.');
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
            <Container fluid className="px-4">
                <div className="dashboard-header" data-aos="fade-up">
                    <div>
                        <h1 className="dashboard-title">Centro de Consultas</h1>
                        <p className="text-muted">Bienvenido{userData?.nombre ? `, ${userData.nombre}` : ''}. Gestiona tus consultas médicas de forma eficiente.</p>
                    </div>
                </div>

                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                                    <Row id="recording-section">
                    <Col md={8} data-aos="fade-up" data-aos-delay="200">
                        <Card className="mb-4 feature-card">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h3>Nueva Consulta Médica</h3>
                                <Badge bg={isRecording ? "danger" : "success"} pill>
                                    {isRecording ? "Grabando" : "Listo para grabar"}
                                </Badge>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-4">
                                    <Form.Label>Nombre de la consulta</Form.Label>
                                    <div className="input">
                                        <Form.Control
                                            type="text"
                                            value={recordingName}
                                            onChange={(e) => setRecordingName(e.target.value)}
                                            placeholder="Ej: Consulta Paciente Juan Pérez - 25/07/2025"
                                            required
                                            className="form-control-lg"
                                        />
                                    </div>
                                    <Form.Text className="text-muted">
                                        Un nombre descriptivo te ayudará a identificar fácilmente esta consulta en el futuro.
                                    </Form.Text>
                                </Form.Group>

                                                                    <div className="recording-section">
                                    <div className="recording-visualizer">
                                        {isRecording && (
                                            <div className="audio-waves">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="recording-controls">
                                        {!isRecording ? (
                                            <Button 
                                                variant="primary" 
                                                size="lg"
                                                onClick={handleStartRecording}
                                                disabled={processingAudio}
                                                className="action-button start-btn"
                                            >
                                                <div className="btn-icon"><IconMic /></div>
                                                <span>Iniciar Grabación</span>
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="danger" 
                                                size="lg"
                                                onClick={handleStopRecording}
                                                className="action-button stop-btn"
                                            >
                                                <div className="btn-icon"><IconStop /></div>
                                                <span>Detener Grabación</span>
                                            </Button>
                                        )}

                                        {audioBlob && !isRecording && (
                                            <Button 
                                                variant="success" 
                                                size="lg"
                                                onClick={handleProcessAudio}
                                                disabled={processingAudio || !recordingName}
                                                className="action-button process-btn ms-3"
                                            >
                                                {processingAudio ? (
                                                    <>
                                                        <div className="btn-icon">
                                                            <Spinner animation="border" size="sm" />
                                                        </div>
                                                        <span>Procesando Audio...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="btn-icon"><IconCpu /></div>
                                                        <span>Analizar con IA</span>
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {audioBlob && !isRecording && (
                                    <div className="audio-preview mb-4" data-aos="fade-up">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className="mb-0">Vista previa de la grabación</h5>
                                            <Badge bg="info">Audio grabado correctamente</Badge>
                                        </div>
                                        <Card className="audio-card">
                                            <Card.Body>
                                                <audio 
                                                    controls 
                                                    src={URL.createObjectURL(audioBlob)}
                                                    className="w-100 custom-audio-player"
                                                    onLoadedMetadata={(e) => {
                                                        // Solo para mostrar una barra de progreso ilustrativa
                                                        const duration = e.target.duration;
                                                        if (duration && duration !== Infinity) {
                                                            // Aquí podrías actualizar un estado si quisieras mostrar la duración
                                                        }
                                                    }}
                                                />

                                                {processingAudio && (
                                                    <div className="mt-3">
                                                        <p className="mb-2">Progreso del análisis:</p>
                                                        <ProgressBar animated now={70} label="Analizando audio..." />
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        {(transcription || summary) && (
                            <Card className="result-card mb-4" data-aos="fade-up">
                                <Card.Header>
                                    <h3>Resultados del Análisis</h3>
                                </Card.Header>
                                <Card.Body>
                                    <Tabs defaultActiveKey="summary" id="result-tabs" className="mb-4">
                                        <Tab eventKey="summary" title="Resumen de la Consulta" className="p-3">
                                            <div className="result-section">
                                                <div className="summary-header mb-3">
                                                    <h4>Resumen de la Consulta Médica</h4>
                                                    <p className="text-muted">Generado por IA basado en la transcripción</p>
                                                </div>
                                                <div className="summary-content">
                                                    {summary ? (
                                                        <div className="formatted-summary">{summary}</div>
                                                    ) : (
                                                        <div className="no-content-placeholder">
                                                            <p>No hay resumen disponible para esta consulta.</p>
                                                            <Button variant="outline-primary" size="sm">Regenerar Resumen</Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="transcription" title="Transcripción Completa" className="p-3">
                                            <div className="result-section">
                                                <div className="transcription-header mb-3">
                                                    <h4>Transcripción Textual</h4>
                                                    <p className="text-muted">Texto completo convertido del audio</p>
                                                </div>
                                                <div className="transcription-content">
                                                    {transcription ? (
                                                        <div className="formatted-transcription">{transcription}</div>
                                                    ) : (
                                                        <div className="no-content-placeholder">
                                                            <p>No hay transcripción disponible para esta consulta.</p>
                                                            <Button variant="outline-primary" size="sm">Regenerar Transcripción</Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="insights" title="Insights Clínicos" className="p-3">
                                            <div className="result-section">
                                                <div className="insights-header mb-3">
                                                    <h4>Insights Clínicos</h4>
                                                    <p className="text-muted">Información relevante detectada por IA</p>
                                                </div>
                                                <div className="insights-content">
                                                    <div className="insight-card">
                                                        <h5>Diagnóstico Potencial</h5>
                                                        <p>Basado en la transcripción, se pueden identificar posibles diagnósticos relacionados.</p>
                                                    </div>
                                                    <div className="insight-card">
                                                        <h5>Medicación Mencionada</h5>
                                                        <p>Lista de medicamentos mencionados durante la consulta.</p>
                                                    </div>
                                                    <div className="insight-card">
                                                        <h5>Próximos Pasos</h5>
                                                        <p>Sugerencias para el seguimiento del paciente.</p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-center">
                                                    <Button variant="outline-primary">Generar Informe Completo</Button>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>

                                            <Col md={4} data-aos="fade-up" data-aos-delay="300">
                        <Card className="recordings-card feature-card">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h3>Historial de Consultas</h3>
                                <Badge bg="primary" pill>{recordings.length} Total</Badge>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Buscar consulta..." 
                                        className="search-recordings"
                                    />
                                </div>

                                {recordings.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">📋</div>
                                        <h5>No hay consultas previas</h5>
                                        <p>Las consultas que grabes aparecerán aquí</p>
                                    </div>
                                ) : (
                                    <div className="recordings-list">
                                        {recordings.map(recording => (
                                            <div key={recording._id} className="recording-item">
                                                <div className="recording-info">
                                                    <h5>{recording.name}</h5>
                                                    <div className="recording-meta">
                                                        <span className="recording-date">
                                                            {new Date(recording.createdAt).toLocaleDateString('es-ES', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                        {recording.duration && (
                                                            <span className="recording-duration">
                                                                {Math.floor(recording.duration / 60)}:{(recording.duration % 60).toString().padStart(2, '0')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="outline-primary" 
                                                    className="recording-action-btn"
                                                    onClick={() => handleViewRecording(recording._id)}
                                                >
                                                    Ver
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {recordings.length > 0 && (
                                    <div className="text-center mt-3">
                                        <Button variant="link">Ver Todas las Consultas</Button>
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
