import React from 'react';
import { Mic, FileText, Library, BrainCircuit } from 'lucide-react';
import './Features.css';

/**
 * Features component for MedScribe AI.
 * Displays the workflow process in a 3-column grid for desktop.
 * * @returns {JSX.Element} The rendered Features section.
 */
const Features: React.FC = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="main-brain-wrapper">
           <BrainCircuit size={64} strokeWidth={1} />
        </div>
        
        <h2 className="section-title">
          Un flujo de trabajo diseñado <br />para tu tranquilidad.
        </h2>
        
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper feat-clay">
              <Mic size={28} />
            </div>
            <h3 className="feature-card-title">1. Grabación y Transcripción</h3>
            <p className="feature-card-desc">
              Captura cada detalle de la consulta con audio de alta fidelidad. Nuestra IA transcribe en tiempo real, diferenciando entre la voz del médico y la del paciente.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper feat-sage">
              <FileText size={28} />
            </div>
            <h3 className="feature-card-title">2. Resumen y Anamnesis</h3>
            <p className="feature-card-desc">
              Transforma la transcripción en documentos clínicos estructurados. Obtén una Anamnesis completa, resumen de síntomas y plan de tratamiento en segundos.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper feat-terra">
              <Library size={28} />
            </div>
            <h3 className="feature-card-title">3. Historial del Paciente</h3>
            <p className="feature-card-desc">
              Cada paciente tiene su perfil digital. Accede fácilmente al audio original, la transcripción completa y los resúmenes generados de todas sus consultas pasadas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;