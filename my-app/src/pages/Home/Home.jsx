import React, { useState } from 'react';
import './Home.css';
import Login from '../Login/Login';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);

  // Funzione per gestire la chiusura cliccando sullo sfondo
  const handleOverlayClick = (e) => {
    if (e.target.className === 'login-overlay') {
      setShowLogin(false);
    }
  };

  return (
    <div>
      <div className={`home-container ${showLogin ? 'blur' : ''}`}>
        <header className="home-header">
          <h1>Gestione Impianti e Macchinari</h1>
          <p>Benvenuto! Gestisci i tuoi impianti e macchinari con facilità.</p>
          <button onClick={() => setShowLogin(true)}>Accedi</button>
        </header>
        <section className="home-content">
          <h2>Funzionalità principali</h2>
          <div className="features">
            <div className="feature-card">
              <h3>Gestione Impianti</h3>
              <p>Crea, modifica e visualizza informazioni sugli impianti.</p>
            </div>
            <div className="feature-card">
              <h3>Gestione Macchinari</h3>
              <p>Monitora e gestisci i macchinari per ogni impianto.</p>
            </div>
            <div className="feature-card">
              <h3>Dashboard Interattiva</h3>
              <p>Visualizza un riepilogo rapido di tutte le tue attività.</p>
            </div>
          </div>
        </section>
      </div>
      {showLogin && (
        <div className="login-overlay" onClick={handleOverlayClick}>
          <Login />
        </div>
      )}
    </div>
  );
};

export default Home;
