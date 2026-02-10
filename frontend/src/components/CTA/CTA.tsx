import React from 'react';
import { Flower2, BadgeCheck, Lock, Cloud } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="cta-section">
      <div className="container" style={{ maxWidth: '896px', position: 'relative', zIndex: 10 }}>
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center', color: 'var(--sage)' }}>
            <Flower2 size={64} strokeWidth={1} />
        </div>
        
        <h2 className="text-serif text-italic" style={{ fontSize: '3.75rem', lineHeight: 1.1, marginBottom: '2rem', color: 'var(--moss)' }}>
          Tu bienestar también es <br/>cuidado del paciente.
        </h2>
        
        <p className="text-serif" style={{ fontSize: '1.25rem', opacity: 0.7, marginBottom: '3rem', maxWidth: '42rem', marginInline: 'auto' }}>
          Únete a miles de médicos que han cambiado el agotamiento por la documentación por una conexión significativa. Solicita una demostración hoy.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            {/* Wrapper for buttons to handle desktop row layout via inline flex check or just flex-wrap */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '1.25rem 3rem' }}>
                    Agendar Demostración
                </button>
                <button className="btn btn-outline" style={{ fontSize: '1.125rem', padding: '1.25rem 3rem' }}>
                    Contactar Ventas
                </button>
            </div>
        </div>
        
        <div className="badges">
          <span className="badge-item">
            <BadgeCheck size={16} /> Seguridad HIPAA
          </span>
          <span className="badge-item">
            <Lock size={16} /> Cumplimiento SOC2
          </span>
          <span className="badge-item">
            <Cloud size={16} /> Listo para EHR
          </span>
        </div>
      </div>
      
      {/* Decorative Blobs */}
      <div className="blob-bg blob-1"></div>
      <div className="blob-bg blob-2"></div>
    </section>
  );
};

export default CTA;