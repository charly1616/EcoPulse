import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {createFacility,
    updateFacility,
    deleteFacility,
    getFacilitiesByCompany} from '../controllers/FacilityController.js'


const router = express.Router();
router.get("/getAll/:CID",protectRoute, getFacilitiesByCompany)
router.put("/update/:id", updateFacility)
router.post("/create", createFacility)
router.delete("/delete/:id", deleteFacility)


export default router;


