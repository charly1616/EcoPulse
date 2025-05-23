import DataPush from "../models/datapush_model.js";

// Crear un nuevo datapush
export const createDataPush = async (req, res) => {
    try {
        const newDataPush = new DataPush(req.body);
        const saved = await newDataPush.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Eliminar un datapush por ID
export const deleteDataPush = async (req, res) => {
    try {
        const deleted = await DataPush.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "DataPush not found" });
        }
        res.status(200).json({ message: "DataPush deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
