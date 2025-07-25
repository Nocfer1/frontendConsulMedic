import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Spinner, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Consultations.css';

const Consultations = () => {
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:5000/api/recordings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar las consultas');
                }

                const data = await response.json();
                setRecordings(data);
            } catch (err) {
                console.error('Error:', err);
                setError('Error al cargar las consultas. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecordings();
    }, [navigate]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleViewDetails = async (recordingId) => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/recordings/${recordingId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar los detalles de la consulta');
            }

            const data = await response.json();
            setSelectedRecording(data);
            setShowModal(true);
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar los detalles de la consulta');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRecording(null);
    };

    const handleDownloadPDF = async (recordingId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/recordings/${recordingId}/export-pdf`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al generar el PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `consulta-${recordingId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error:', err);
            setError('Error al descargar el PDF');
        }
    };

    const handleDeleteRecording = async (recordingId) => {
        if (!window.confirm('¿Está seguro de que desea eliminar esta consulta? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/recordings/${recordingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la consulta');
            }

            // Actualizar la lista de grabaciones
            setRecordings(recordings.filter(recording => recording._id !== recordingId));

            if (selectedRecording && selectedRecording._id === recordingId) {
                handleCloseModal();
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error al eliminar la consulta');
        }
    };

    // Ordenar grabaciones
    const sortedRecordings = [...recordings].sort((a, b) => {
        if (sortField === 'createdAt') {
            return sortDirection === 'asc' 
                ? new Date(a.createdAt) - new Date(b.createdAt) 
                : new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortField === 'name') {
            return sortDirection === 'asc' 
                ? a.name.localeCompare(b.name) 
                : b.name.localeCompare(a.name);
        }
        return 0;
    });

    // Filtrar grabaciones por término de búsqueda
    const filteredRecordings = sortedRecordings.filter(recording => 
        recording.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRecordings = filteredRecordings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRecordings.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (loading && recordings.length === 0) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <div className="consultations-page">
            <Container>
                <h1 className="mb-4">Mis Consultas Médicas</h1>
                {error && <Alert variant="danger">{error}</Alert>}

                <Card className="mb-4">
                    <Card.Body>
                        <Row className="align-items-center">
                            <Col md={6}>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <i className="bi bi-search"></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar por nombre..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={6} className="text-md-end mt-3 mt-md-0">
                                <Button 
                                    variant="primary" 
                                    onClick={() => navigate('/dashboard')}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Nueva Consulta
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        {currentRecordings.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-file-earmark-text display-1 text-muted"></i>
                                <h3 className="mt-3">No hay consultas</h3>
                                <p className="text-muted">Comience a grabar su primera consulta médica desde el Dashboard</p>
                                <Button 
                                    variant="primary" 
                                    onClick={() => navigate('/dashboard')}
                                    className="mt-3"
                                >
                                    Ir al Dashboard
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <Table hover className="consultations-table">
                                        <thead>
                                            <tr>
                                                <th onClick={() => handleSort('name')} className="sortable-header">
                                                    Nombre
                                                    {sortField === 'name' && (
                                                        <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                                    )}
                                                </th>
                                                <th onClick={() => handleSort('createdAt')} className="sortable-header">
                                                    Fecha
                                                    {sortField === 'createdAt' && (
                                                        <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                                    )}
                                                </th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRecordings.map(recording => (
                                                <tr key={recording._id}>
                                                    <td>{recording.name}</td>
                                                    <td>{formatDate(recording.createdAt)}</td>
                                                    <td>
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleViewDetails(recording._id)}
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Button>
                                                        <Button 
                                                            variant="outline-success" 
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleDownloadPDF(recording._id)}
                                                        >
                                                            <i className="bi bi-file-earmark-pdf"></i>
                                                        </Button>
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm"
                                                            onClick={() => handleDeleteRecording(recording._id)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>

                                {/* Paginación */}
                                {totalPages > 1 && (
                                    <div className="pagination-container mt-4">
                                        <ul className="pagination justify-content-center">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => paginate(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Anterior
                                                </button>
                                            </li>
                                            {[...Array(totalPages).keys()].map(number => (
                                                <li 
                                                    key={number + 1} 
                                                    className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                                                >
                                                    <button
                                                        className="page-link"
                                                        onClick={() => paginate(number + 1)}
                                                    >
                                                        {number + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => paginate(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Siguiente
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal de detalles */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                {selectedRecording ? (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedRecording.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-4">
                                <h5>Información</h5>
                                <p><strong>Fecha:</strong> {formatDate(selectedRecording.createdAt)}</p>
                            </div>

                            <div className="mb-4">
                                <h5>Transcripción</h5>
                                <div className="transcription-content">
                                    {selectedRecording.transcription || 'No hay transcripción disponible'}
                                </div>
                            </div>

                            <div>
                                <h5>Resumen</h5>
                                <div className="summary-content">
                                    {selectedRecording.summary || 'No hay resumen disponible'}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button 
                                variant="outline-success" 
                                onClick={() => handleDownloadPDF(selectedRecording._id)}
                            >
                                <i className="bi bi-file-earmark-pdf me-2"></i>
                                Descargar PDF
                            </Button>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </>
                ) : (
                    <div className="p-5 text-center">
                        <Spinner animation="border" />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Consultations;
