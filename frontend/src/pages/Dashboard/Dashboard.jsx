import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import {
    IconMic, IconCpu, IconUpload, IconDictation, IconHistory, IconFolder, IconFolderPlus, IconPencil, IconTrash, IconSearch
} from '../../components/Icons';
import API_BASE from '../../apiConfig';

const Dashboard = () => {
    const navigate = useNavigate();

    // -------------------- Estado --------------------
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recordings, setRecordings] = useState([]);

    // Mic
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const [audioBlob, setAudioBlob] = useState(null);

    // Resultados
    const [transcription, setTranscription] = useState('');
    const [summary, setSummary] = useState('');

    // UI/flujo
    const [processingAudio, setProcessingAudio] = useState(false);
    const [recordingName, setRecordingName] = useState('');
    const [lastResultSource, setLastResultSource] = useState(null); // 'upload' | 'mic' | null
    const [processingSource, setProcessingSource] = useState(null); // 'upload' | 'mic' | null

    // Sidebar
    const [folders, setFolders] = useState([
        { id: 'inbox', name: 'General' },
        { id: 'reports', name: 'Informes' }
    ]);
    const [selectedFolder, setSelectedFolder] = useState('inbox');

    const fileInputRef = useRef(null);

    // -------------------- Helpers comunes --------------------
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const callFinalize = async (summaryFileName) => {
        const token = localStorage.getItem('token');
        return fetch(`${API_BASE}/recordings/finalize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            // El backend espera un STRING JSON, no un objeto
            body: JSON.stringify(summaryFileName)
        });
    };

    // Polling tolerante a GCS NotFound y con backoff suave
    const waitForFinalize = async (
        summaryFileName,
        {
            maxMs = 180000,      // ~3 min
            startDelayMs = 3000, // espera inicial para consistencia de GCS
            stepMs = 2000,       // primer intervalo
            stepMaxMs = 10000    // tope del intervalo
        } = {}
    ) => {
        await sleep(startDelayMs);
        const started = Date.now();
        let delay = stepMs;

        while (Date.now() - started < maxMs) {
            const res = await callFinalize(summaryFileName);
            const text = await res.text().catch(() => '');

            if (res.status === 200) {
                try { return JSON.parse(text); } catch { return {}; }
            }

            const isTransient =
                res.status === 202 ||
                ((res.status === 500 || res.status === 404) && /NotFound|storage|GCS/i.test(text));

            // Esperar y seguir intentando
            await sleep(delay);
            delay = Math.min(delay + 1000, stepMaxMs);

            if (!isTransient && res.status !== 429) {
                // Si no es un estado transitorio (ni 202/404/500 con GCS), seguimos igual
                // porque el back histórico a veces responde 400/415 momentáneos.
            }
        }
        throw new Error('El resumen no estuvo listo a tiempo.');
    };

    // Convierte WAV/MP3/M4A a WebM/Opus en el navegador (si no ya es WebM)
    const ensureWebM = async (file) => {
        const looksWebM = (file?.type || '').includes('webm') || /\.webm$/i.test(file?.name || '');
        if (looksWebM) return file;

        if (!window.MediaRecorder || !MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            throw new Error('Este navegador no puede convertir a WebM. Sube un archivo .webm');
        }

        // 1) Decodificar a PCM
        const arrayBuffer = await file.arrayBuffer();
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const buffer = await ctx.decodeAudioData(arrayBuffer);

        // 2) Reproducir el buffer hacia un destino de MediaStream y grabarlo como WebM/Opus
        const dest = ctx.createMediaStreamDestination();
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(dest);

        const chunks = [];
        const rec = new MediaRecorder(dest.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 128000 });
        rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        const stopped = new Promise(res => { rec.onstop = res; });

        rec.start(100);
        src.start();

        const stopAfter = Math.ceil(buffer.duration * 1000) + 120; // margen
        setTimeout(() => { if (rec.state !== 'inactive') rec.stop(); }, stopAfter);
        await stopped;

        try { src.disconnect(); dest.disconnect(); ctx.close(); } catch {}

        const blob = new Blob(chunks, { type: 'audio/webm' });
        const base = (file.name || 'audio').replace(/\.[^/.]+$/, '') || 'audio';
        return new File([blob], `${base}.webm`, { type: 'audio/webm' });
    };

    // -------------------- Carga de usuario y listados --------------------
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) { navigate('/login'); return; }

                const profileRes = await fetch(`${API_BASE}/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!profileRes.ok) throw new Error('No se pudo obtener la información del usuario');
                setUserData(await profileRes.json());

                const recRes = await fetch(`${API_BASE}/recordings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (recRes.ok) setRecordings(await recRes.json());
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos del usuario');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    // -------------------- Subir archivo --------------------
    const handleClickUpload = () => fileInputRef.current?.click();

    const processUploadedFile = async (file) => {
        setProcessingSource('upload');
        setProcessingAudio(true);
        setError('');
        setTranscription('');
        setSummary('');
        try {
            // Asegurar WebM real
            const webmFile = await ensureWebM(file);

            const formData = new FormData();
            formData.append('audioFile', webmFile, webmFile.name || 'audio.webm');

            const uploadResponse = await fetch(`${API_BASE}/recordings/upload`, {
                method: 'POST',
                body: formData
            });
            if (!uploadResponse.ok) throw new Error('Error al subir el archivo');

            const uploadData = await uploadResponse.json();
            const uploadedFileName = (uploadData.uri || '').split('/').pop(); // ej: GUID.webm
            const summaryFileName = `resumen-${uploadedFileName}.txt`;        // contrato histórico del back

            console.debug('[finalize][derived]', { uploadedFileName, summaryFileName });

            const resultData = await waitForFinalize(summaryFileName);
            setSummary(resultData?.summary || 'No se pudo obtener el resumen.');
            setRecordingName('');
            setLastResultSource('upload');

            const token = localStorage.getItem('token');
            const recRes = await fetch(`${API_BASE}/recordings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (recRes.ok) setRecordings(await recRes.json());
        } catch (err) {
            console.error('Error:', err);
            setError(err?.message || 'Error al procesar el archivo. Intenta nuevamente.');
        } finally {
            setProcessingAudio(false);
            setProcessingSource(null);
        }
    };

    const handleUploadFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await processUploadedFile(file);
        e.target.value = ''; // permitir re-subir el mismo archivo
    };

    // -------------------- Micrófono --------------------
    const handleStartRecording = async () => {
        try {
            setLastResultSource('mic');
            setProcessingSource('mic');
            setTranscription('');
            setSummary('');

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            const chunks = [];
            mr.ondataavailable = (e) => { if (e.data?.size) chunks.push(e.data); };
            mr.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
            };
            mr.start();
            mediaRecorderRef.current = mr;
            setIsRecording(true);
        } catch (err) {
            console.error('Error al iniciar la grabación:', err);
            setError('No se pudo acceder al micrófono');
        }
    };

    const handleStopRecording = () => {
        const mr = mediaRecorderRef.current;
        if (mr && isRecording) {
            mr.stop();
            mr.stream.getTracks().forEach(t => t.stop());
            setIsRecording(false);
        }
    };

    // nombre sugerido tras grabar
    useEffect(() => {
        if (audioBlob && !recordingName) {
            const d = new Date();
            const stamp = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
            setRecordingName(`Consulta ${stamp}`);
        }
    }, [audioBlob, recordingName]);

    const handleProcessAudio = async () => {
        if (!audioBlob) { setError('Por favor graba audio'); return; }

        setProcessingSource('mic');
        setProcessingAudio(true);
        setError('');
        setTranscription('');
        setSummary('');

        try {
            const formData = new FormData();
            formData.append('audioFile', audioBlob, 'grabacion.webm');

            const uploadResponse = await fetch(`${API_BASE}/recordings/upload`, {
                method: 'POST',
                body: formData
            });
            if (!uploadResponse.ok) throw new Error('Error al subir el audio');

            const uploadData = await uploadResponse.json();
            const uploadedFileName = (uploadData.uri || '').split('/').pop();
            const summaryFileName = `resumen-${uploadedFileName}.txt`;

            const resultData = await waitForFinalize(summaryFileName);
            setSummary(resultData?.summary || 'No se pudo obtener el resumen.');

            // refrescar listado
            const token = localStorage.getItem('token');
            const recRes = await fetch(`${API_BASE}/recordings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (recRes.ok) setRecordings(await recRes.json());

            setAudioBlob(null);
            setRecordingName('');
            setLastResultSource('mic');
        } catch (err) {
            console.error('Error:', err);
            setError(err?.message || 'Error al procesar el audio. Intenta nuevamente.');
        } finally {
            setProcessingAudio(false);
            setProcessingSource(null);
        }
    };

    // -------------------- Otros --------------------
    const handleViewRecording = async (recordingId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/recordings/${recordingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('No se pudo obtener la grabación');
            const data = await response.json();
            setTranscription(data.transcription || '');
            setSummary(data.summary || '');
        } catch (err) {
            console.error(err);
            setError('Error al cargar la grabación');
        }
    };

    const startMicFlow = () => {
        if (isRecording) handleStopRecording();
        setTranscription('');
        setSummary('');
        setAudioBlob(null);
        setProcessingAudio(false);
        setRecordingName('');
        setLastResultSource('mic');
    };

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

    // -------------------- Render --------------------
    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

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
                <div className="main-header">
                    <h1>Dashboard</h1>
                    <div className="searchbar">
                        <IconSearch size={18} />
                        <input className="form-control" placeholder="Buscar por nombre, fecha o estado…" />
                    </div>
                    <div className="ms-auto badge bg-secondary">{planName}</div>
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

                {/* Estado vacío */}
                {showEmptyState && (
                    <div className="empty-state">
                        <div className="empty-icon">↑</div>
                        <h4>Agrega tu primera consulta</h4>
                        <p>Sube un archivo o graba audio. Crearemos transcripciones y resúmenes para ti.</p>
                        <Button variant="primary" onClick={handleClickUpload} disabled={processingAudio}>
                            Explorar opciones
                        </Button>
                    </div>
                )}

                {/* Flujo principal */}
                {!showEmptyState && (
                    <>
                        {lastResultSource === 'upload' ? (
                            <Card className="mb-4">
                                <Card.Header><h3>Consulta procesada</h3></Card.Header>
                                <Card.Body>
                                    {processingSource === 'upload' && processingAudio && (
                                        <Alert variant="info" className="mb-3 d-flex align-items-center">
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Analizando archivo subido… Esto puede tardar unos minutos.
                                        </Alert>
                                    )}

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
                                                    <button className="btn btn-primary" onClick={handleStartRecording} disabled={processingAudio}>
                                                        <span className="me-2"><IconMic /></span>
                                                        Iniciar grabación
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-danger" onClick={handleStopRecording}>
                                                        Detener grabación
                                                    </button>
                                                )}

                                                {audioBlob && !isRecording && (
                                                    <button
                                                        className="btn btn-success ms-3"
                                                        onClick={handleProcessAudio}
                                                        disabled={processingAudio || !recordingName}
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
                                                    </button>
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
