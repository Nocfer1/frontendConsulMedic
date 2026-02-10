import React from 'react';
import { Mic, FileText, Library, BrainCircuit } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section className="features-section">
      <div className="container" style={{ maxWidth: '1152px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
           <BrainCircuit size={64} color="var(--clay)" strokeWidth={1} />
        </div>
        <h2 className="section-title">
          Un flujo de trabajo diseñado <br />para tu tranquilidad.
        </h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper feat-clay">
              <Mic size={28} />
            </div>
            <h3 className="text-serif text-italic" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Grabación y Transcripción</h3>
            <p style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '0.875rem' }}>
              Captura cada detalle de la consulta con audio de alta fidelidad. Nuestra IA transcribe en tiempo real, diferenciando entre la voz del médico y la del paciente.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper feat-sage">
              <FileText size={28} />
            </div>
            <h3 className="text-serif text-italic" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Resumen y Anamnesis</h3>
            <p style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '0.875rem' }}>
              Transforma la transcripción en documentos clínicos estructurados. Obtén una Anamnesis completa, resumen de síntomas y plan de tratamiento en segundos.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper feat-terra">
              <Library size={28} />
            </div>
            <h3 className="text-serif text-italic" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Historial del Paciente</h3>
            <p style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '0.875rem' }}>
              Cada paciente tiene su perfil digital. Accede fácilmente al audio original, la transcripción completa y los resúmenes generados de todas sus consultas pasadas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;