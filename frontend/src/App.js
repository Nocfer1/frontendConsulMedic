import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavigationBar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';

function App() {
  return (
      <Router>
        <div className="App">
          <NavigationBar />
          <Hero />
        </div>
      </Router>
  );
}

export default App;