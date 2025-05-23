import express from 'express';
import {createArea,
    updateArea,
    deleteArea} from "../controllers/AreaController.js"
import {createDevice,
    updateDevice,
    deleteDevice} from "../controllers/DeviceController.js"

const router = express.Router();
router.post("/createArea", createArea)
router.post("/createDevice", createDevice)
router.put("/updateArea/:id", updateArea)
router.put("/updateDevice/:id", updateDevice)
router.delete("/deleteArea/:id", deleteArea)
router.delete("/deleteDevice/:id", deleteDevice)


export default router;
