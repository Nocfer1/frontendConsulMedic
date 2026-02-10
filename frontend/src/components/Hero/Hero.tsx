import React from 'react';
import { Sparkles, Mic, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      {/* Background Gradients using inline styles for dynamic positioning if needed, or CSS classes */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '500px', height: '500px', backgroundColor: 'rgba(134, 148, 128, 0.1)', borderRadius: '50%', filter: 'blur(64px)', zIndex: -10, transform: 'translate(50%, -50%)' }}></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '500px', height: '500px', backgroundColor: 'rgba(176, 125, 98, 0.05)', borderRadius: '50%', filter: 'blur(64px)', zIndex: -10, transform: 'translate(-50%, 50%)' }}></div>

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
            <span className="text-italic" style={{ color: 'var(--sage)' }}>Anamnesis perfecta.</span>
          </h1>
          
          <p className="hero-desc">
            Graba tu consulta, obtén una transcripción exacta y deja que la IA redacte el resumen y la anamnesis. Todo guardado automáticamente en el historial del paciente.
          </p>

          <div style={{ marginTop: '3rem' }}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="hero-card card-recording"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--terracotta)', marginBottom: '0.5rem' }}>
                <Mic size={16} />
                <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grabando Consulta</p>
              </div>
              <p className="text-serif text-italic" style={{ fontSize: '1.125rem', color: 'rgba(74, 93, 78, 0.8)' }}>"...el dolor comenzó hace dos días en la zona lumbar y aumenta al caminar."</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="hero-card card-anamnesis"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--sage)', marginBottom: '0.5rem' }}>
                <FileText size={16} />
                <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Anamnesis Generada</p>
              </div>
              <p style={{ fontSize: '0.875rem', fontFamily: 'var(--font-sans)', color: 'var(--moss)', lineHeight: 1.6 }}>
                <strong>Motivo de consulta:</strong> Lumbalgia aguda.<br/>
                <strong>Evolución:</strong> 48 horas de evolución.<br/>
                <strong>Agravantes:</strong> Deambulación.<br/>
                <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block', marginTop: '0.5rem' }}>Guardado en Historial: Paciente #4092</span>
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="blob-container"
        >
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(134, 148, 128, 0.2)', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(64px)', zIndex: -10, transform: 'scale(1.25)' }}></div>
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
            <Sparkles size={24} color="var(--sage)" style={{ marginBottom: '0.5rem' }} />
            <p className="text-serif text-italic" style={{ fontSize: '0.875rem', color: 'var(--moss)' }}>"Tu voz es la única herramienta que necesitas. El historial se construye solo."</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;