import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import API_BASE from '../../apiConfig';
import './Profile.css'; 

const Profile = () => {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState({
        nombre: '',
        correo: '',
        especialidad: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [stats, setStats] = useState({
        totalConsultas: 0,
        totalTranscripciones: 0,
        tiempoAhorrado: 0
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    setError('No se encontró la sesión del usuario');
                    setLoading(false);
                    return;
                }

                // Obtener información del usuario
                const userResponse = await fetch(`${API_BASE}/user/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (userResponse.ok) {
                    const user = await userResponse.json();
                    setUserData({
                        ...userData,
                        nombre: user.nombre || '',
                        correo: user.correo || '',
                        especialidad: user.especialidad || ''
                    });
                } else {
                    throw new Error('No se pudo obtener la información del usuario');
                }

                // Obtener estadísticas del usuario
                const statsResponse = await fetch(`${API_BASE}/user/stats`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (statsResponse.ok) {
                    const statsData = await statsResponse.json();
                    setStats(statsData);
                }
            } catch (error) {
                console.error('Error al cargar datos del usuario:', error);
                setError('Error al cargar datos del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setUpdating(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró la sesión del usuario');
            }

            const response = await fetch(`${API_BASE}/user/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: userData.nombre,
                    especialidad: userData.especialidad
                })
            });

            if (response.ok) {
                setSuccess('Perfil actualizado correctamente');
            } else {
                const text = await response.text();
                throw new Error(text || 'Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            setError(error.message || 'Error al actualizar el perfil');
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setUpdating(true);

        if (userData.newPassword !== userData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setUpdating(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No se encontró la sesión del usuario');
            }

            const response = await fetch(`${API_BASE}/user/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: userData.currentPassword,
                    newPassword: userData.newPassword
                })
            });

            if (response.ok) {
                setSuccess('Contraseña actualizada correctamente');
                setUserData({
                    ...userData,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                const text = await response.text();
                throw new Error(text || 'Error al actualizar la contraseña');
            }
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            setError(error.message || 'Error al actualizar la contraseña');
        } finally {
            setUpdating(false);
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
        <div className="profile-page">
            <Container>
                <h1 className="mb-4">Mi Perfil</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Row>
                    <Col md={8}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h3>Información Personal</h3>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleProfileUpdate}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre Completo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            value={userData.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="correo"
                                            value={userData.correo}
                                            disabled
                                        />
                                        <Form.Text className="text-muted">
                                            El email no se puede cambiar
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Especialidad Médica</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="especialidad"
                                            value={userData.especialidad}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        disabled={updating}
                                    >
                                        {updating ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Actualizando...
                                            </>
                                        ) : 'Actualizar Perfil'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Header>
                                <h3>Cambiar Contraseña</h3>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handlePasswordUpdate}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Contraseña Actual</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="currentPassword"
                                            value={userData.currentPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Nueva Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="newPassword"
                                            value={userData.newPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={userData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        disabled={updating}
                                    >
                                        {updating ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Actualizando...
                                            </>
                                        ) : 'Cambiar Contraseña'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Header>
                                <h3>Estadísticas</h3>
                            </Card.Header>
                            <Card.Body>
                                <div className="stats-item">
                                    <div className="stats-icon">
                                        <i className="bi bi-file-earmark-medical"></i>
                                    </div>
                                    <div className="stats-info">
                                        <h4>{stats.totalConsultas}</h4>
                                        <p>Consultas Totales</p>
                                    </div>
                                </div>

                                <div className="stats-item">
                                    <div className="stats-icon">
                                        <i className="bi bi-file-text"></i>
                                    </div>
                                    <div className="stats-info">
                                        <h4>{stats.totalTranscripciones}</h4>
                                        <p>Transcripciones</p>
                                    </div>
                                </div>

                                <div className="stats-item">
                                    <div className="stats-icon">
                                        <i className="bi bi-clock-history"></i>
                                    </div>
                                    <div className="stats-info">
                                        <h4>{stats.tiempoAhorrado} hrs</h4>
                                        <p>Tiempo Ahorrado</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Header>
                                <h3>Plan Actual</h3>
                            </Card.Header>
                            <Card.Body>
                                <div className="plan-info">
                                    <h4>Plan Profesional</h4>
                                    <p className="text-primary fw-bold">$49.99/mes</p>
                                    <p>Renovación: 15/08/2025</p>

                                    <div className="mt-3">
                                        <h5>Características:</h5>
                                        <ul className="plan-features">
                                            <li><i className="bi bi-check-circle-fill"></i> Transcripciones ilimitadas</li>
                                            <li><i className="bi bi-check-circle-fill"></i> Resúmenes ilimitados</li>
                                            <li><i className="bi bi-check-circle-fill"></i> Exportación PDF/Word</li>
                                            <li><i className="bi bi-check-circle-fill"></i> Soporte prioritario</li>
                                        </ul>
                                    </div>

                                    <Button variant="outline-primary" className="w-100 mt-3">
                                        Gestionar Suscripción
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Profile;
