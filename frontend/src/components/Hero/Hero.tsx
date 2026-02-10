import React from 'react';
import { Sparkles, Mic, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import './Hero.css';

/**
 * Hero component for MedScribe AI.
 * Displays the main value proposition with animated cards and imagery.
 * * @returns {JSX.Element} The rendered Hero section.
 */
const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="bg-blob-top"></div>
      <div className="bg-blob-bottom"></div>

      <div className="hero-grid">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-subtitle">
            <span className="hero-line"></span> Escucha Inteligente
          </div>
          
          <h1 className="hero-title">
            De la conversación a la <br />
            <span className="title-accent">Anamnesis perfecta.</span>
          </h1>
          
          <p className="hero-desc">
            Graba tu consulta, obtén una transcripción exacta y deja que la IA redacte el resumen y la anamnesis. Todo guardado automáticamente en el historial del paciente.
          </p>

          <div className="hero-cards-container">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="hero-card card-recording"
            >
              <div className="card-header recording-header">
                <Mic size={16} />
                <p className="card-status-label">Grabando Consulta</p>
              </div>
              <p className="card-quote text-serif text-italic">
                "...el dolor comenzó hace dos días en la zona lumbar y aumenta al caminar."
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="hero-card card-anamnesis"
            >
              <div className="card-header anamnesis-header">
                <FileText size={16} />
                <p className="card-status-label">Anamnesis Generada</p>
              </div>
              <div className="card-body-text">
                <p><strong>Motivo de consulta:</strong> Lumbalgia aguda.</p>
                <p><strong>Evolución:</strong> 48 horas de evolución.</p>
                <p><strong>Agravantes:</strong> Deambulación.</p>
                <span className="card-footer-text">Guardado en Historial: Paciente #4092</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="blob-container"
        >
          <div className="image-blob-bg"></div>
          <div className="hero-image-wrapper">
            <img 
              alt="Physician utilizing tablet for recording" 
              className="hero-image"
              src="https://images.unsplash.com/photo-1576091160550-2187d80aeff2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            />
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="hero-float-card"
          >
            <Sparkles size={24} className="float-card-icon" />
            <p className="float-card-text text-serif text-italic">
              "Tu voz es la única herramienta que necesitas. El historial se construye solo."
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;