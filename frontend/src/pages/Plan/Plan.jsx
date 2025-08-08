import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../../apiConfig';

const Plan = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [usage, setUsage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        (async () => {
            try {
                const [uRes, usgRes] = await Promise.allSettled([
                    fetch(`${API_BASE}/user/profile`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${API_BASE}/billing/usage`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (uRes.status === 'fulfilled' && uRes.value.ok) {
                    const u = await uRes.value.json();
                    setUser(u);
                } else {
                    throw new Error('No se pudo cargar el usuario.');
                }

                if (usgRes.status === 'fulfilled' && usgRes.value.ok) {
                    const data = await usgRes.value.json();
                    setUsage(data);
                }
            } catch (e) {
                setError(e.message || 'Error al cargar el plan');
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate]);

    const planName = user?.planName || user?.plan || user?.subscription?.plan || 'Gratis';
    const renewDate = user?.subscription?.renewalDate || user?.planRenewalDate || null;

    // Deriva uso si tu API lo expone con otros nombres
    const minutesUsed  = usage?.transcriptionMinutesUsed ?? usage?.minutesUsed ?? null;
    const minutesLimit = usage?.transcriptionMinutesLimit ?? usage?.minutesLimit ?? null;
    const percent = (minutesUsed != null && minutesLimit)
        ? Math.min(100, Math.round((minutesUsed / minutesLimit) * 100))
        : null;

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight:'60vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h1 className="mb-1">Mi plan</h1>
                    <div className="text-muted">Estado de tu suscripción y límites de uso</div>
                </Col>
            </Row>

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            <Row className="g-4">
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Header><strong>Resumen</strong></Card.Header>
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="fs-5 mb-1">
                                        Plan actual <span className="badge bg-light text-dark ms-2">{planName}</span>
                                    </div>
                                    <div className="text-muted">
                                        {renewDate ? `Renueva el ${new Date(renewDate).toLocaleDateString()}` : 'Renovación: N/D'}
                                    </div>
                                </div>
                                <div>
                                    {planName === 'Gratis' ? (
                                        <Button variant="primary" onClick={() => navigate('/billing')}>Mejorar plan</Button>
                                    ) : (
                                        <Button variant="outline-primary" onClick={() => navigate('/billing')}>Gestionar</Button>
                                    )}
                                </div>
                            </div>

                            <hr/>

                            <ul className="mb-0">
                                <li>Transcripción y resumen automático de consultas</li>
                                <li>Almacenamiento seguro de grabaciones</li>
                                <li>Soporte por correo</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="h-100">
                        <Card.Header><strong>Límites y uso</strong></Card.Header>
                        <Card.Body>
                            {minutesLimit ? (
                                <>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Minutos de transcripción</span>
                                        <span>{minutesUsed ?? 0} / {minutesLimit}</span>
                                    </div>
                                    <ProgressBar now={percent ?? 0} animated />
                                    <small className="text-muted d-block mt-2">{percent ?? 0}% usado este ciclo</small>
                                </>
                            ) : (
                                <div className="text-muted">No hay datos de uso disponibles.</div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4 mt-1">
                <Col md={12}>
                    <Card>
                        <Card.Header><strong>Pagos</strong></Card.Header>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="mb-1">Consulta tu historial de pagos y boletas/facturas.</div>
                                <small className="text-muted">Si aún no tienes suscripción, puedes contratarla aquí.</small>
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="outline-secondary" onClick={() => navigate('/billing/history')}>Historial</Button>
                                <Button variant="primary" onClick={() => navigate('/billing')}>
                                    {planName === 'Gratis' ? 'Contratar' : 'Gestionar'}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Plan;
