import React from 'react';
import { Leaf, Globe, Sprout } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ maxWidth: '1280px', padding: '0 2rem' }}>
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Leaf color="var(--sage)" size={24} />
              <span className="text-serif text-italic" style={{ fontSize: '1.25rem', color: 'var(--stone)' }}>MedScribe AI</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.6, maxWidth: '20rem' }}>
              Nutriendo el lado humano de la medicina a través de tecnología empática.
            </p>
          </div>
          
          <div>
            <h5>Caminos</h5>
            <ul>
              <li><a href="#">La Tecnología</a></li>
              <li><a href="#">Bienestar Médico</a></li>
              <li><a href="#">Seguridad y Confianza</a></li>
            </ul>
          </div>
          
          <div>
            <h5>Empresa</h5>
            <ul>
              <li><a href="#">Nuestra Historia</a></li>
              <li><a href="#">Contáctanos</a></li>
              <li><a href="#">Ética</a></li>
            </ul>
          </div>
          
          <div>
            <h5>Síguenos</h5>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" className="social-icon">
                <Globe size={16} />
              </a>
              <a href="#" className="social-icon">
                <Sprout size={16} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 MedScribe AI. Creado para los que cuidan.</p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#">Privacidad Mental</a>
            <a href="#">Términos de Cuidado</a>
            <a href="#">Cumplimiento</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;