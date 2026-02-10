import React from 'react';
import { ArrowRight, Mic, FileText, Database, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import './HowItWorks.css';

/**
 * Interfaz para definir la estructura de cada paso del proceso.
 */
interface Step {
  id: number;
  title: string;
  description: string;
  Icon: LucideIcon;
}

/**
 * Listado de pasos del flujo de trabajo de MedScribe AI.
 */
const STEPS: Step[] = [
  {
    id: 1,
    title: "Paso 1: Graba la Consulta",
    description: "Simplemente presiona grabar al inicio de la cita. Concéntrate en el paciente mientras la app captura el audio de manera segura.",
    Icon: Mic
  },
  {
    id: 2,
    title: "Paso 2: Transcripción y Anamnesis",
    description: "Al finalizar, nuestra IA procesa el audio. En segundos, tienes una transcripción fiel y una Anamnesis estructurada lista para revisión.",
    Icon: FileText
  },
  {
    id: 3,
    title: "Paso 3: Archivo en Historial",
    description: "Todo se vincula al perfil del paciente. Tendrás una línea de tiempo con los audios y resúmenes de cada visita anterior.",
    Icon: Database
  }
];

/**
 * Componente que explica el funcionamiento del sistema con animaciones de entrada.
 * @returns {JSX.Element} Sección "Cómo funciona" estilizada.
 */
const HowItWorks: React.FC = () => {
  return (
    <section className="how-section">
      <div className="how-container">
        <div className="how-grid">
          
          {/* Columna de Imagen con Efectos Decorativos */}
          <motion.div 
            className="how-visual-wrapper"
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="image-frame-container">
              <img 
                alt="Médico revisando historial clínico digital" 
                className="how-image"
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80" 
              />
              <div className="image-overlay" />
            </div>
          </motion.div>

          {/* Columna de Contenido y Pasos */}
          <motion.div 
            className="how-content"
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="how-title text-serif">
                Tu asistente clínico <br/>
                <span className="text-italic accent-color">invisible y eficiente.</span>
            </h2>

            <div className="steps-list">
              {STEPS.map(({ id, title, description, Icon }) => (
                <div key={id} className="step-item">
                  <span className="step-dot" aria-hidden="true" />
                  <div className="step-header">
                    <Icon size={20} className="step-icon" />
                    <h4 className="step-title text-serif text-italic">{title}</h4>
                  </div>
                  <p className="step-description">{description}</p>
                </div>
              ))}
            </div>

            <div className="how-actions">
              <button className="btn btn-primary-large">
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