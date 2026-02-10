import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import './VideoSection.css';

/**
 * Componente que muestra una sección de video demostrativo.
 * Utiliza Framer Motion para animaciones de entrada y Lucide para iconos.
 * * @returns {JSX.Element} La sección de video de la landing page.
 */
const VideoSection: React.FC = () => {
  return (
    <section className="video-section">
      <div className="video-container">
        <h2 className="video-title text-serif">
          De Audio a Anamnesis en segundos
        </h2>
        <p className="video-description">
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
                <Play 
                  size={32} 
                  className="play-icon" 
                  fill="currentColor" 
                />
             </div>
          </div>
          
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Video de demostración generación de anamnesis" 
            className="video-thumbnail"
          />
          
          <div className="video-info">
            <p className="video-info-title text-serif">Demo: Generación automática de historial clínico</p>
            <p className="video-info-duration">Duración: 1:30</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;