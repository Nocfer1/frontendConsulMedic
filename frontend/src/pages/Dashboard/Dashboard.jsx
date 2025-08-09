import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { motion } from 'motion/react';
import {
    IconMic, IconSearch, IconCpu,
    IconUpload, IconLink, IconDictation,
    IconFolder, IconFolderPlus, IconTrash, IconPencil, IconHistory
} from '../../components/Icons';
import API_BASE from '../../apiConfig';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError] = useState('');
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
    const [lastResultSource, setLastResultSource] = useState(null); // 'upload' | 'mic' | null
    const [processingSource, setProcessingSource] = useState(null); // 'upload' | 'mic' | null


    // ---------- Cargar datos de usuario y grabaciones ----------
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) { navigate('/login'); return; }

                const response = await fetch(`${API_BASE}/user/profile`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('No se pudo obtener la información del usuario');
                const data = await response.json();
                setUserData(data);

                const recordingsResponse = await fetch(`${API_BASE}/recordings`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (recordingsResponse.ok) {
                    const recordingsData = await recordingsResponse.json();
                    setRecordings(Array.isArray(recordingsData) ? recordingsData : []);
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

    // ---------- Sidebar (carpetas) ----------
    const [folders, setFolders] = useState([
        { id: 'inbox',   name: 'General'  },
        { id: 'reports', name: 'Informes' },
    ]);
    const [selectedFolder, setSelectedFolder] = useState('inbox');
    const fileInputRef = useRef(null);

    const handleAddFolder = () => {
        const name = prompt('Nombre de la carpeta:');
        if (!name) return;
        const id = `${Date.now()}`;
        setFolders(prev => [...prev, { id, name }]);
        setSelectedFolder(id);
    };
    const handleRenameFolder = (id) => {
        const name = prompt('Nuevo nombre:');
        if (!name) return;
        setFolders(prev => prev.map(f => f.id === id ? ({ ...f, name }) : f));
    };
    const handleDeleteFolder = (id) => {
        if (!confirm('¿Eliminar carpeta?')) return;
        setFolders(prev => prev.filter(f => f.id !== id));
        if (selectedFolder === id) setSelectedFolder('inbox');
    };

    // Subir archivo (mismo pipeline que grabación)
    const handleClickUpload = () => fileInputRef.current?.click();

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

        throw new Error('El resumen no estuvo listo a tiempo.');
    };

    const processUploadedFile = async (file) => {
        setProcessingSource('upload');
        setProcessingAudio(true);
        setError('');
        setTranscription('');
        setSummary('');
        try {
            const formData = new FormData();
            formData.append('audioFile', file);

            const uploadResponse = await fetch(`${API_BASE}/recordings/upload`, {
                method: 'POST',
                body: formData
            });
            if (!uploadResponse.ok) throw new Error('Error al subir el archivo');

            const uploadData = await uploadResponse.json();
            const uploadedFileName = decodeURIComponent(uploadData.uri.split('/').pop());
            const summaryFileName  = `resumen-${uploadedFileName}.txt`;

            const resultData = await waitForFinalize(summaryFileName);

            setSummary(resultData.summary || 'No se pudo obtener el resumen.');
            setRecordingName('');           // el nombre lo pone el doctor, no el archivo
            setLastResultSource('upload');  // para que NO aparezca el menú de grabación

            const token = localStorage.getItem('token');
            const recordingsResponse = await fetch(`${API_BASE}/recordings`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (recordingsResponse.ok) setRecordings(await recordingsResponse.json());
        } catch (err) {
            console.error('Error:', err);
            setError('Error al procesar el archivo. Intenta nuevamente.');
        } finally {
            setProcessingAudio(false);
            setProcessingSource(null);
        }
    };

    const handleUploadFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await processUploadedFile(file);
        e.target.value = ''; // permitir subir el mismo archivo de nuevo
    };

    const handleImportUrl = async () => {
        const url = prompt('Pega la URL del audio/archivo:');
        if (!url) return;
        // TODO: implementar importación por URL en el backend
        console.log('URL a importar:', url);
    };

    // ---------- Grabación (micrófono) ----------
    const handleStartRecording = async () => {
        try {
            setLastResultSource('mic');
            setProcessingSource('mic');
            setTranscription('');
            setSummary('');

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = e => { chunks.push(e.data); };
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

    // Nombre sugerido cuando termina de grabar y hay blob
    useEffect(() => {
        if (audioBlob && !recordingName) {
            const d = new Date();
            const stamp = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
            setRecordingName(`Consulta ${stamp}`);
        }
    }, [audioBlob, recordingName]);

    const handleProcessAudio = async () => {
        if (!audioBlob) { setError('Por favor grabe audio'); return; }

        setProcessingSource('mic');
        setProcessingAudio(true);
        setError('');
        setTranscription('');
        setSummary('');

        try {
            const formData = new FormData();
            formData.append('audioFile', audioBlob);

            const uploadResponse = await fetch(`${API_BASE}/recordings/upload`, {
                method: 'POST',
                body: formData
            });
            if (!uploadResponse.ok) throw new Error('Error al subir el audio');

            const uploadData = await uploadResponse.json();
            const uploadedFileName = uploadData.uri.split('/').pop();
            const summaryFileName  = `resumen-${uploadedFileName}.txt`;

            const resultData = await waitForFinalize(summaryFileName);

            setSummary(resultData.summary || 'No se pudo obtener el resumen.');
            const token = localStorage.getItem('token');
            const recordingsResponse = await fetch(`${API_BASE}/recordings`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (recordingsResponse.ok) setRecordings(await recordingsResponse.json());

            setAudioBlob(null);
            setRecordingName('');
        } catch (err) {
            console.error('Error:', err);
            setError('Error al procesar el audio. Intenta nuevamente.');
        } finally {
            setProcessingAudio(false);
            setProcessingSource(null);
        }
    };

    const handleViewRecording = async (recordingId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/recordings/${recordingId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('No se pudo obtener la grabación');

            const data = await response.json();
            setTranscription(data.transcription);
            setSummary(data.summary);
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar la grabación');
        }
    };

    // limpiar la vista de resultados/estados previos
    const resetConsultView = () => {
        setTranscription('');
        setSummary('');
        setAudioBlob(null);
        setIsRecording(false);
        setProcessingAudio(false);
        setError && setError('');
    };

    // Al iniciar el flujo de micrófono desde el botón superior
    const startMicFlow = () => {
        if (isRecording) handleStopRecording(); // por si quedó algo activo

        // limpiar restos de un flujo anterior (subida o mic)
        setTranscription('');
        setSummary('');
        setAudioBlob(null);
        setAudioChunks([]);
        setIsRecording(false);
        setProcessingAudio(false);

        setProcessingSource('mic'); // solo para la UI; no muestra spinner
        setRecordingName('');       // que el doctor escriba el nombre
        setLastResultSource('mic'); // ⬅️ fuerza la tarjeta "Nueva Consulta Médica"     // que el doctor escriba el nombre  // cambia la tarjeta a “Nueva Consulta Médica”
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    // Oculta el empty state si estás grabando o procesando
    const showEmptyState =
        !transcription &&
        !summary &&
        recordings.length === 0 &&
        !audioBlob &&
        !isRecording &&
        !processingAudio &&
        !lastResultSource;

    const planName = userData?.planName || userData?.plan || userData?.subscription?.plan || 'Gratis';

    return (
        <div className="dashboard-shell">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h6>Carpetas</h6>
                    <Button variant="link" className="p-0" onClick={handleAddFolder} title="Nueva carpeta">
                        <IconFolderPlus size={18} />
                    </Button>
                </div>

                <div className="folder-list">
                    {folders.map(f => (
                        <div
                            key={f.id}
                            className={`folder-item ${selectedFolder === f.id ? 'active' : ''}`}
                            onClick={() => setSelectedFolder(f.id)}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <IconFolder size={18} />
                                <span>{f.name}</span>
                            </div>
                            <div className="folder-actions">
                                <Button variant="link" className="p-0 me-2" onClick={(e)=>{e.stopPropagation();handleRenameFolder(f.id);}} title="Renombrar">
                                    <IconPencil size={16} />
                                </Button>
                                <Button variant="link" className="p-0" onClick={(e)=>{e.stopPropagation();handleDeleteFolder(f.id);}} title="Eliminar">
                                    <IconTrash size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="sidebar-section mt-4">
                    <h6>Recientes</h6>
                    <div className="recent-list">
                        {recordings.slice(0,5).map(r => (
                            <button
                                key={r._id}
                                className="recent-item"
                                onClick={() => handleViewRecording(r._id)}
                                title={r.name}
                            >
                                <IconHistory size={16} />
                                <span className="text-truncate">{r.name}</span>
                            </button>
                        ))}
                        {recordings.length === 0 && <small className="text-muted">Sin registros</small>}
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="main">
                {/* Header con buscador */}
                <div className="main-header">
                    <h1>Dashboard</h1>
                    <div className="searchbar">
                        <IconSearch size={18} />
                        <input className="form-control" placeholder="Buscar por nombre, fecha o estado…" />
                    </div>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                {/* Acciones rápidas */}
                <div className="quick-actions">
                    <button className="action-card action-upload" onClick={handleClickUpload} disabled={processingAudio}>
                        <IconUpload size={22} />
                        <span>{processingAudio ? 'Procesando…' : 'Subir archivo'}</span>
                        <input
                            ref={fileInputRef}
                            onChange={handleUploadFileChange}
                            type="file"
                            accept="audio/*,video/*,.wav,.mp3,.m4a,.webm"
                            hidden
                        />
                    </button>

                    <button className="action-card action-url" onClick={handleImportUrl} disabled={processingAudio}>
                        <IconLink size={22} />
                        <span>Importar URL</span>
                    </button>

                    <button
                        className="action-card action-mic"
                        onClick={startMicFlow}
                        disabled={processingAudio}
                        title="Grabar consulta (micrófono)"
                    >
                        <IconMic size={22} />
                        <span>Grabar consulta (micrófono)</span>
                    </button>

                    <button
                        className="action-card action-dictation"
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        disabled={processingAudio}
                        title={isRecording ? 'Detener grabación' : 'Nuevo dictado'}
                    >
                        <IconDictation size={22} />
                        <span>{isRecording ? 'Detener grabación' : 'Nuevo dictado'}</span>
                    </button>
                </div>

                {/* Estado vacío centrado */}
                {showEmptyState && (
                    <div className="empty-state">
                        <div className="empty-icon">↑</div>
                        <h4>Agrega tu primera consulta</h4>
                        <p>Sube un archivo, importa una URL o graba audio. Crearemos transcripciones y resúmenes para ti.</p>
                        <Button variant="primary" onClick={handleClickUpload} disabled={processingAudio}>
                            Explorar opciones
                        </Button>
                    </div>
                )}

                {/* Bloque de “Nueva Consulta” + resultados (cuando haya actividad) */}
                {/* Bloque de “Nueva Consulta” + resultados (cuando haya actividad) */}
                {!showEmptyState && (
                    <>
                        {lastResultSource === 'upload' ? (
                            // ========= Vista post-subida de archivo =========
                            <Card className="mb-4">
                                <Card.Header><h3>Consulta procesada</h3></Card.Header>
                                <Card.Body>
                                    {processingSource === 'upload' && processingAudio ? (
                                        <Alert variant="info" className="mb-3 d-flex align-items-center">
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Analizando archivo subido… Esto puede tardar unos minutos.
                                        </Alert>
                                    ) : null}

                                    <Form.Group className="mb-2">
                                        <Form.Label>Nombre de la consulta</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={recordingName}
                                            onChange={(e) => setRecordingName(e.target.value)}
                                            placeholder="Ej: Consulta Paciente Juan Pérez - 25/07/2025"
                                            required
                                        />
                                    </Form.Group>

                                    <small className="text-muted">
                                        Para grabar una nueva consulta, usa “Grabar consulta (micrófono)” en Acciones rápidas.
                                    </small>
                                </Card.Body>
                            </Card>
                        ) : (
                            // ========= Flujo normal de micrófono =========
                            <Card className="mb-4">
                                <Card.Header><h3>Nueva Consulta Médica</h3></Card.Header>
                                <Card.Body>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre de la consulta</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={recordingName}
                                            onChange={(e) => setRecordingName(e.target.value)}
                                            placeholder="Ej: Consulta Paciente Juan Pérez - 25/07/2025"
                                            required
                                            disabled={processingSource === 'upload' && processingAudio}
                                        />
                                    </Form.Group>

                                    <div className="recording-controls mb-4">
                                        {processingSource === 'upload' && processingAudio ? (
                                            <Alert variant="info" className="mb-0 d-flex align-items-center">
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Analizando archivo subido… Esto puede tardar unos minutos.
                                            </Alert>
                                        ) : (
                                            <>
                                                {!isRecording ? (
                                                    <motion.button
                                                        className="btn btn-primary"
                                                        onClick={() => { setLastResultSource('mic'); handleStartRecording(); }}
                                                        disabled={processingAudio}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                    >
                                                        <span className="me-2"><IconMic /></span>
                                                        Iniciar grabación
                                                    </motion.button>
                                                ) : (
                                                    <motion.button
                                                        className="btn btn-danger recording-btn"
                                                        onClick={handleStopRecording}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                    >
                                                        Detener grabación
                                                    </motion.button>
                                                )}

                                                {audioBlob && !isRecording && (
                                                    <motion.button
                                                        className="btn btn-success ms-3"
                                                        onClick={handleProcessAudio}
                                                        disabled={processingAudio || !recordingName}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                    >
                                                        {processingAudio ? (
                                                            <>
                                                                <Spinner animation="border" size="sm" className="me-2" />
                                                                Procesando…
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="me-2"><IconCpu /></span>
                                                                Procesar audio
                                                            </>
                                                        )}
                                                    </motion.button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                        {(transcription || summary) && (
                            <Row>
                                <Col md={12}>
                                    <Card className="mb-4">
                                        <Card.Header><h3>Transcripción</h3></Card.Header>
                                        <Card.Body>
                                            <div className="transcription-content">
                                                {transcription || 'No hay transcripción disponible'}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={12}>
                                    <Card className="mb-4">
                                        <Card.Header><h3>Resumen de la consulta</h3></Card.Header>
                                        <Card.Body>
                                            <div className="summary-content">
                                                {summary || 'No hay resumen disponible'}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </>
                )}

            </main>
        </div>
    );
};

export default Dashboard;
