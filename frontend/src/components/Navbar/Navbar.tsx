import React from 'react';
import './Navbar.css'; // Importación de tu clase externa

/**
 * Navbar component for MedScribe AI.
 * Implementado con CSS puro y TSX.
 */
const Navbar: React.FC = () => {
  return (
    <nav className="nav-wrapper">
      <div className="navbar-pill">
        
        {/* Lado izquierdo: Logo */}
        <div className="navbar-brand">
          <LeafIcon />
          <span className="brand-text">
            MedScribe <span className="brand-accent">AI</span>
          </span>
        </div>

        {/* Lado derecho: Links y Botón */}
        <div className="navbar-actions">
          <a href="#filosofia" className="nav-item">Nuestra Filosofía</a>
          <a href="#experiencia" className="nav-item">La Experiencia</a>
        </div>

      </div>
    </nav>
  );
};

const LeafIcon = () => (
  <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C10.9 14.36 12 12 12 12" />
  </svg>
);

export default Navbar;