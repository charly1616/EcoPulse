import Device from "../models/device_model.js";

// Crear un nuevo Device
export const createDevice = async (req, res) => {
    try {
        const newDevice = new Device(req.body);
        const savedDevice = await newDevice.save();
        res.status(201).json(savedDevice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar un Device por ID
export const updateDevice = async (req, res) => {
    try {
        const updatedDevice = await Device.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedDevice) {
            return res.status(404).json({ error: "Device not found" });
        }
        res.status(200).json(updatedDevice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un Device por ID
export const deleteDevice = async (req, res) => {
    try {
        const deletedDevice = await Device.findByIdAndDelete(req.params.id);
        if (!deletedDevice) {
            return res.status(404).json({ error: "Device not found" });
        }
        res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


