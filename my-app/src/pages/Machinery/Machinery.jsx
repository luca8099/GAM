import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Layout/Sidebar";
import machineryService from "../../services/machineryService";
import plantsService from "../../services/plantsService";
import LoadingPopup from '../../components/LoadingPopup/LoadingPopup';
import "./Machinery.css";

const Machinery = () => {
  const [machinery, setMachinery] = useState([]);
  const [plants, setPlants] = useState([]);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Stato di caricamento


  // Recupera i dati iniziali
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const machineryData = await machineryService.getAllMachinery();
        const plantsData = await plantsService.getAllPlants();
        setMachinery(machineryData);
        setPlants(plantsData);
        setError("");
      } catch (err) {
        setError("Errore nel recupero dei dati");
        console.error(err);
      }finally { setLoading(false); // Nascondi il popup di caricamento
      }
    };
    fetchData();
  }, []);

  const handleAdd = () => {
    setCurrentMachine(null);
    setShowForm(true);
    setSuccess("");
    setError("");
    setSelectedPlant("");
  };

  const handleEdit = (machine) => {
    setCurrentMachine(machine);
    setShowForm(true);
    setSuccess("");
    setError("");
    setSelectedPlant(machine.plant_id || "");
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await machineryService.deleteMachinery(id);
      setMachinery(machinery.filter((machine) => machine._id !== id));
      setSuccess("Macchinario eliminato con successo");
      setError("");
    } catch (err) {
      setError("Errore nell'eliminazione del macchinario");
      console.error(err);
      setSuccess("");
    } finally { 
      setLoading(false); // Nascondi il popup di caricamento 
      }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newMachine = {
      name: e.target.name.value,
      type: e.target.type.value,
      status: e.target.status.value,
      plant_id: selectedPlant || null,
    };

    try {
      if (currentMachine && currentMachine._id) {
        // Modifica macchinario
        await machineryService.updateMachinery(currentMachine._id, newMachine);

        // Aggiorna lo stato locale
        setMachinery(
          machinery.map((machine) =>
            machine._id === currentMachine._id
              ? { ...newMachine, _id: machine._id }
              : machine
          )
        );
        setSuccess("Macchinario modificato con successo");
      } else {
        // Aggiunta macchinario
        const addedMachine = await machineryService.addMachinery(newMachine);

        // Aggiorna lo stato locale
        setMachinery([
          ...machinery,
          { ...newMachine, _id: addedMachine.id },
        ]);
        setSuccess("Macchinario aggiunto con successo");
      }
      setShowForm(false);
      setError("");
    } catch (err) {
      console.error("Errore nella gestione del macchinario:", err);
      setError(err.message || "Errore nella gestione del macchinario");
      setSuccess("");
    } finally { setLoading(false); // Nascondi il popup di caricamento
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "form-overlay") {
      setShowForm(false);
      setError("");
      setSuccess("");
    }
  };

  return (
    <div className="machinery">
      <Sidebar />
      <div className="machinery-content">
        <h1>Gestione Macchinari</h1>
        {error && <p className="error">{error}</p>}
        {loading && <LoadingPopup />} {/* Mostra il popup di caricamento */}
        {success && <p className="success">{success}</p>}
        <div className="machinery-list">
          {machinery.map((machine) => (
            <div className="machine-card" key={machine._id}>
              <h2>{machine.name}</h2>
              <p>
                <strong>Tipo:</strong> {machine.type}
              </p>
              <p>
                <strong>Stato:</strong> {machine.status}
              </p>
              <p>
                <strong>Impianto Associato:</strong>{" "}
                {plants.find((plant) => plant._id === machine.plant_id)?.name ||
                  "Nessuno"}
              </p>
              <div className="card-actions">
                <button onClick={() => handleEdit(machine)}>✎</button>
                <button onClick={() => handleDelete(machine._id)}>🗑</button>
              </div>
            </div>
          ))}
          <div className="add-card" onClick={handleAdd}>
            <span></span>
          </div>
        </div>
      </div>
      {showForm && (
        <div className="form-overlay" onClick={handleOverlayClick}>
          <div className="form-popup" onClick={(e) => e.stopPropagation()}>
            <h2>
              {currentMachine ? "Modifica Macchinario" : "Aggiungi Macchinario"}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                <input
                  name="name"
                  defaultValue={currentMachine?.name || ""}
                  placeholder=" "
                  required
                />
                <span>Nome:</span>
              </label>
              <label>
                <input
                  name="type"
                  defaultValue={currentMachine?.type || ""}
                  placeholder=" "
                  required
                />
                <span>Tipo:</span>
              </label>
              <label>
                <input
                  name="status"
                  defaultValue={currentMachine?.status || ""}
                  placeholder=" "
                  required
                />
                <span>Stato:</span>
              </label>

              <div className="plant-selection">
                <h3>Impianti Disponibili:</h3>
                <div className="plant-list">
                  {plants.map((plant) => (
                    <button
                      key={plant._id.toString()} // Convertito in stringa
                      type="button"
                      className={`plant-item ${
                        selectedPlant === plant._id.toString() ? "selected" : ""
                      }`}
                      onClick={() =>
                        setSelectedPlant(
                          selectedPlant === plant._id.toString() ? "" : plant._id.toString()
                        )
                      }
                    >
                      {plant.name}
                    </button>
                  ))}
                </div>

                <h4>Impianto Selezionato:</h4>
                <p>
                  {plants.find((p) => p._id === selectedPlant)?.name ||
                    "Nessuno"}
                </p>
              </div>

                <button
                  type="submit"
                  onClick={async (e) => {
                    e.preventDefault();
                  
                    const newMachine = {
                      name: e.target.form.name.value,
                      type: e.target.form.type.value,
                      status: e.target.form.status.value,
                      plant_id: selectedPlant || null,
                    };
                  
                    try {
                      if (currentMachine && currentMachine._id) {
                        // Modifica macchinario
                        await machineryService.updateMachinery(currentMachine._id, newMachine);
                      
                        // Aggiorna lo stato locale
                        setMachinery(
                          machinery.map((machine) =>
                            machine._id === currentMachine._id
                              ? { ...newMachine, _id: machine._id }
                              : machine
                          )
                        );
                        setSuccess("Macchinario modificato con successo");
                      } else {
                        // Aggiunta macchinario
                        console.log("sono qui")
                        const addedMachine = await machineryService.addMachinery(newMachine.plant_id,newMachine);
                      
                        // Aggiorna lo stato locale
                        setMachinery([
                          ...machinery,
                          { ...newMachine, _id: addedMachine.id },
                        ]);
                        setSuccess("Macchinario aggiunto con successo");
                      }
                      setShowForm(false);
                      setError("");
                    } catch (err) {
                      console.error("Errore nella gestione del macchinario:", err);
                      setError(err.message || "Errore nella gestione del macchinario");
                      setSuccess("");
                    }
                  }}
                  >
                  {currentMachine ? "Salva Modifiche" : "Aggiungi"}
                </button>

              <button type="button" onClick={() => setShowForm(false)}>
                Annulla
              </button>
            </form>
          </div>
        </div>
      )}
      {loading && <LoadingPopup />}
    </div>
  );
};

export default Machinery;
