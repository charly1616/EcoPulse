import Area from "../models/area_model.js";
import Facility from "../models/facility_model.js";

// Crear un área
export const createArea = async (req, res) => {
    try {
        const { Name, FacilityID, ...rest } = req.body;

        // Validar que FacilityID sea un ObjectId válido
        if (!FacilityID || !FacilityID.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid or missing FacilityID" });
        }

        // Verificar que exista la Facility
        const facilityExists = await Facility.findById(FacilityID);
        if (!facilityExists) {
            return res.status(404).json({ error: "FacilityID does not exist" });
        }

        // Crear y guardar el área
        const newArea = new Area({ Name, FacilityID, ...rest });
        const savedArea = await newArea.save();

        return res.status(201).json(savedArea);
    } catch (error) {
        console.error("Error creating area:", error);
        return res.status(500).json({ error: "Server error creating area" });
    }
};


// Actualizar un área
export const updateArea = async (req, res) => {
    try {
        const updatedArea = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedArea) {
            return res.status(404).json({ error: "Area not found" });
        }
        res.status(200).json(updatedArea);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un área (y sus dispositivos)
export const deleteArea = async (req, res) => {
    try {
        const deletedArea = await Area.findOneAndDelete({ _id: req.params.id });
        if (!deletedArea) {
            return res.status(404).json({ error: "Area not found" });
        }
        res.status(200).json({ message: "Area and associated devices deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


