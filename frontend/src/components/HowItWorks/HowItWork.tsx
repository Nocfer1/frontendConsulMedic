import React from 'react';
import { ArrowRight, Mic, FileText, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks: React.FC = () => {
  return (
    <section className="how-section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '5rem', alignItems: 'center' }}>
        {/* Note: In CSS file, we added media query to make this row on desktop */}
        <div className="hero-grid" style={{ gap: '5rem', maxWidth: '1280px' }}>
            <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            >
            <div style={{ position: 'relative', borderRadius: '4rem', overflow: 'hidden', border: '12px solid #fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                <img 
                alt="Doctor reviewing digital history" 
                style={{ width: '100%', height: 'auto', display: 'block', transform: 'scale(1)', transition: 'transform 0.7s' }}
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80" 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(74, 93, 78, 0.4), transparent)' }}></div>
            </div>
            </motion.div>

            <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
            >
            <h2 className="text-serif" style={{ fontSize: '3rem', lineHeight: 1.1, color: 'var(--moss)' }}>
                Tu asistente clínico <br/>
                <span className="text-italic" style={{ color: 'var(--terracotta)' }}>invisible y eficiente.</span>
            </h2>

            <div className="steps-container">
                <div className="step-item">
                    <span className="step-dot"></span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Mic size={20} color="var(--terracotta)" />
                        <h4 className="text-serif text-italic" style={{ fontSize: '1.25rem', color: 'var(--moss)' }}>Paso 1: Graba la Consulta</h4>
                    </div>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.6 }}>Simplemente presiona grabar al inicio de la cita. Concéntrate en el paciente mientras la app captura el audio de manera segura.</p>
                </div>
                
                <div className="step-item">
                    <span className="step-dot"></span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <FileText size={20} color="var(--terracotta)" />
                        <h4 className="text-serif text-italic" style={{ fontSize: '1.25rem', color: 'var(--moss)' }}>Paso 2: Transcripción y Anamnesis</h4>
                    </div>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.6 }}>Al finalizar, nuestra IA procesa el audio. En segundos, tienes una transcripción fiel y una Anamnesis estructurada lista para revisión.</p>
                </div>
                
                <div className="step-item">
                    <span className="step-dot"></span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Database size={20} color="var(--terracotta)" />
                        <h4 className="text-serif text-italic" style={{ fontSize: '1.25rem', color: 'var(--moss)' }}>Paso 3: Archivo en Historial</h4>
                    </div>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.6 }}>Todo se vincula al perfil del paciente. Tendrás una línea de tiempo con los audios y resúmenes de cada visita anterior.</p>
                </div>
            </div>

            <div>
                <button className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1.25rem 2.5rem' }}>
                    Ver el Historial en Acción
                    <ArrowRight size={20} />
                </button>
            </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;