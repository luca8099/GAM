const BASE_URL = "http://localhost:8000";

const getMachineryById = async (machineryId) => {
  try {
    const response = await fetch(`${BASE_URL}/machinery/${machineryId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Errore nel recupero del macchinario");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore in getMachineryById:", error);
    throw error;
  }
};

const addMachinery = async (plant_id, machinery) => {
  try {
    console.log(plant_id);
    const response = await fetch(`${BASE_URL}/machinery/${plant_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(machinery),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Errore nell'aggiunta del macchinario");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore in addMachinery:", error);
    throw error;
  }
};

const updateMachinery = async (machineryId, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/machinery/${machineryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Errore nella modifica del macchinario");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore in updateMachinery:", error);
    throw error;
  }
};

const deleteMachinery = async (machineryId) => {
  try {
    const response = await fetch(`${BASE_URL}/machinery/${machineryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Errore nell'eliminazione del macchinario");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore in deleteMachinery:", error);
    throw error;
  }
};

const getAllMachinery = async () => {
  try {
    const response = await fetch(`${BASE_URL}/machinery`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Errore nel recupero di tutti i macchinari");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore in getAllMachinery:", error);
    throw error;
  }
};

const searchMachinery = async (query) => {
  try {
    const params = new URLSearchParams(query).toString();
    const response = await fetch(`${BASE_URL}/machinery/search?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Errore nella ricerca dei macchinari");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore in searchMachinery:", error);
    throw error;
  }
};

export default {
  getMachineryById,
  addMachinery,
  updateMachinery,
  deleteMachinery,
  getAllMachinery,
  searchMachinery, // Aggiunta della funzione searchMachinery
};
