const BASE_URL = "http://localhost:8000";

const getAllPlants = async () => {
  try {
    const response = await fetch(`${BASE_URL}/plants`);

    if (!response.ok) {
      throw new Error("Errore nel recupero degli impianti");
    }

    return await response.json();
  } catch (error) {
    throw error.message;
  }
};

const getPlantById = async (plantId) => {
  try {
    const response = await fetch(`${BASE_URL}/plants/${plantId}`);

    if (!response.ok) {
      throw new Error("Errore nel recupero dell'impianto");
    }

    return await response.json();
  } catch (error) {
    throw error.message;
  }
};

const addPlant = async (plant) => {
  try {
    const response = await fetch(`${BASE_URL}/plants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plant),
    });

    if (!response.ok) {
      throw new Error("Errore nell'aggiunta dell'impianto");
    }

    return await response.json();
  } catch (error) {
    throw error.message;
  }
};

const updatePlant = async (plantId, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/plants/${plantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Errore nella modifica dell'impianto");
    }

    return await response.json();
  } catch (error) {
    throw error.message;
  }
};

const deletePlant = async (plantId) => {
  try {
    const response = await fetch(`${BASE_URL}/plants/${plantId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Errore nell'eliminazione dell'impianto");
    }

    return await response.json();
  } catch (error) {
    throw error.message;
  }
};

export default {
  getAllPlants,
  getPlantById,
  addPlant,
  updatePlant,
  deletePlant,
};
