import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import plantsService from '../../services/plantsService';
import machineryService from '../../services/machineryService';
import LoadingPopup from '../../components/LoadingPopup/LoadingPopup';
import './Plants.css';

const Plants = () => {
  const [plants, setPlants] = useState([]); // Lista degli impianti
  const [machinery, setMachinery] = useState([]); // Lista dei macchinari globali
  const [currentPlant, setCurrentPlant] = useState(null); // Impianto selezionato per modifica
  const [selectedMachinery, setSelectedMachinery] = useState([]); // Macchinari selezionati per l'impianto
  const [showForm, setShowForm] = useState(false); // Mostra il popup del form
  const [error, setError] = useState(''); // Gestione errori
  const [loading, setLoading] = useState(false); // Stato di caricamento

  // Recupera gli impianti e i macchinari dal backend all'inizio
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const plantsData = await plantsService.getAllPlants();
        const machineryData = await machineryService.getAllMachinery();
        setPlants(plantsData);
        setMachinery(machineryData);
      } catch (err) {
        setError('Errore nel recupero dei dati');
        console.error(err);
      }finally { setLoading(false); // Nascondi il popup di caricamento
      }
    };
    fetchData();
  }, []);

  const handleAdd = () => {
    setCurrentPlant(null); 
    setSelectedMachinery([]); 
    setShowForm(true);
  };

  const handleEdit = (plant) => {
    setCurrentPlant(plant); 
    setSelectedMachinery(plant.machinery || []); 
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await plantsService.deletePlant(id);
      setPlants(plants.filter((plant) => plant._id !== id));
    } catch (err) {
      setError('Errore nell\'eliminazione dell\'impianto');
      console.error(err);
    }finally { setLoading(false); // Nascondi il popup di caricamento 
    }
  };

  const handleMachinerySelection = (machineId) => {
    if (selectedMachinery.includes(machineId)) {
      setSelectedMachinery(selectedMachinery.filter((id) => id !== machineId));
    } else {
      setSelectedMachinery([...selectedMachinery, machineId]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newPlant = {
      name: e.target.name.value,
      location: e.target.location.value,
      description: e.target.description.value,
      machinery: selectedMachinery,
    };

    try {
      if (currentPlant) {
        // Modifica
        await plantsService.updatePlant(currentPlant._id, newPlant);
        setPlants(
          plants.map((plant) =>
            plant._id === currentPlant._id ? { ...newPlant, _id: plant._id } : plant
          )
        );
      } else {
        // Aggiungi
        const addedPlant = await plantsService.addPlant(newPlant);
        setPlants([...plants, { ...newPlant, _id: addedPlant.id }]);
      }
      setShowForm(false); // Chiudi il popup
    } catch (err) {
      setError('Errore nella gestione dell\'impianto');
      console.error(err);
    }finally {
      setLoading(false); // Nascondi il popup di caricamento
       }
  };

  return (
    <div className="plants">
      <Sidebar />
      <div className="plants-content">
        <h1>Gestione Impianti</h1>
        {error && <p className="error">{error}</p>}
        {loading && <LoadingPopup />} {/* Mostra il popup di caricamento */}
        <div className="plants-list">
          {plants.map((plant) => (
            <div className="plant-card" key={plant._id}>
              <h2>{plant.name}</h2>
              <p><strong>ID Impianto:</strong> {plant._id}</p> {/* Mostra l'ID dell'impianto */}
              <p><strong>Posizione:</strong> {plant.location}</p>
              <p><strong>Descrizione:</strong> {plant.description}</p>
              <p>
                <strong>Macchinari Associati:</strong>
                {plant.machinery.length > 0
                  ? plant.machinery
                      .map((id) => machinery.find((machine) => machine._id === id)?.name || 'Nome non disponibile')
                      .join(', ')
                  : 'Nessuno'}
              </p>
              <div className="card-actions">
                <button onClick={() => handleEdit(plant)}>✎</button>
                <button onClick={() => handleDelete(plant._id)}>🗑</button>
              </div>
            </div>
          ))}
          <div className="add-card" onClick={handleAdd}>
           
          </div>
        </div>
      </div>
      {showForm && (
        <div className="form-overlay">
          <div className="form-popup">
            <h2>{currentPlant ? 'Modifica Impianto' : 'Aggiungi Impianto'}</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                <input name="name" placeholder=" " defaultValue={currentPlant?.name || ''} required />
                <span>Nome:</span>
              </label>
              <label>
                <input name="location" placeholder=" " defaultValue={currentPlant?.location || ''} required />
                <span>Posizione:</span>
              </label>
              <label>
                <textarea name="description" placeholder=" " defaultValue={currentPlant?.description || ''} required />
                <span>Descrizione:</span>
              </label>
              <div className="machinery-selection">
                
                <h4>Macchinari Associati:</h4>
                <p>{selectedMachinery.map(id => machinery.find(m => m._id === id)?.name).join(', ') || 'Nessuno'}</p>
              </div>
              <button type="submit">{currentPlant ? 'Salva Modifiche' : 'Aggiungi'}</button>
              <button type="button" onClick={() => setShowForm(false)}>Annulla</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plants;
