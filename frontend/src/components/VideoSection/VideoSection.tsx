import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoSection: React.FC = () => {
  return (
    <section className="video-section">
      <div className="container" style={{ maxWidth: '1024px', textAlign: 'center' }}>
        <h2 className="text-serif" style={{ fontSize: '2.25rem', marginBottom: '1rem', color: 'var(--moss)' }}>
          De Audio a Anamnesis en segundos
        </h2>
        <p style={{ opacity: 0.6, marginBottom: '3rem', maxWidth: '42rem', marginInline: 'auto' }}>
          Mira cómo MedScribe graba la consulta y organiza automáticamente el historial del paciente con resúmenes clínicos precisos.
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="video-wrapper"
        >
          <div className="video-overlay">
             <div className="play-button">
                <Play size={32} color="var(--moss)" style={{ marginLeft: '4px' }} fill="currentColor" />
             </div>
          </div>
          
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Video de demostración generación de anamnesis" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
          />
          
          <div className="video-info">
            <p className="text-serif" style={{ fontSize: '1.125rem' }}>Demo: Generación automática de historial clínico</p>
            <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Duración: 1:30</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;