import Facility from "../models/facility_model.js";
import Area from "../models/area_model.js";
import Device from "../models/device_model.js";
import Company from '../models/company_model.js';
import DataPush from "../models/datapush_model.js";


// Crear una nueva Facility
export async function createFacility(req, res) {
    try {
        const { Name, CompanyID } = req.body;

        if (!Name || !CompanyID) {
            return res.status(400).json({ message: "Name and CompanyID are required" });
        }

        const facility = new Facility({
            Name: Name,
            CompanyID: CompanyID
        });

        const saved = await facility.save();
        return res.status(201).json(saved);

    } catch (err) {
        console.error("Error creating facility:", err);
        return res.status(500).json({ message: "Server error creating facility" });
    }
}

// Actualizar una Facility existente
export async function updateFacility(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updated = await Facility.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Facility not found" });
        }

        return res.status(200).json(updated);

    } catch (err) {
        console.error("Error updating facility:", err);
        return res.status(500).json({ message: "Server error updating facility" });
    }
}

// Eliminar una Facility (activa middlewares en cascada)
export async function deleteFacility(req, res) {
    try {
        const { id } = req.params;

        const deleted = await Facility.findOneAndDelete({ _id: id });

        if (!deleted) {
            return res.status(404).json({ message: "Facility not found" });
        }

        return res.status(200).json({ message: "Facility deleted successfully" });

    } catch (err) {
        console.error("Error deleting facility:", err);
        return res.status(500).json({ message: "Server error deleting facility" });
    }
}

// Obtener todas las Facilities de una empresa, incluyendo áreas, dispositivos y datapushes
export async function getFacilitiesByCompany(req, res) {
  try {
    const { CID } = req.params;

    // 1. Get all facilities for the company
    const facilities = await Facility.find({ CompanyID: CID }).lean();

    // 2. For each facility, get its areas
    for (const facility of facilities) {
      facility.areas = await Area.find({ FacilityID: facility._id }).lean();

      // 3. For each area, get its devices
      for (const area of facility.areas) {
        area.devices = await Device.find({ AreaID: area._id }).lean();
        //console.log(area.devices)

        // 4. For each device, get its datapushes
        for (const device of area.devices) {
          device.datapushes = await DataPush.find({ DeviceID: device._id }).lean();
        }
      }
    }

    return res.status(200).json(facilities);

  } catch (err) {
    console.error("Error getting facilities:", err);
    return res.status(500).json({ message: "Server error retrieving facilities" });
  }
}




