import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import plantsService from '../../services/plantsService';
import machineryService from '../../services/machineryService';
import authService from '../../services/authService';
import LoadingPopup from '../../components/LoadingPopup/LoadingPopup';

import './Dashboard.css';

const Dashboard = () => {
  const [plantCount, setPlantCount] = useState(0);
  const [machineryCount, setMachineryCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Stato di caricamento


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ottieni il numero totale di impianti
        const plants = await plantsService.getAllPlants();
        setPlantCount(plants.length);

        // Ottieni il numero totale di macchinari
        const machinery = await machineryService.getAllMachinery({});
        setMachineryCount(machinery.length);

        // Ottieni il numero totale di utenti (mock per ora)
        const users = await authService.getAllUsers(); // Se hai un endpoint per gli utenti
        setUserCount(users.length);
      } catch (err) {
        setError('');
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Benvenuto nella Dashboard</h1>
          <p>Gestisci i tuoi impianti e macchinari con facilità.</p>
        </div>
        {error && <p className="error">{error}</p>}
        {loading && <LoadingPopup />} {/* Mostra il popup di caricamento */} 
        {!loading && (
        <div className="info-cards">
          <div className="card">
            <h3>Impianti</h3>
            <p>Totale: {plantCount}</p>
          </div>
          <div className="card">
            <h3>Macchinari</h3>
            <p>Totale: {machineryCount}</p>
          </div>
          <div className="card">
            <h3>Utenti Attivi</h3>
            <p>Totale: {userCount}</p>
          </div>
        </div>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
