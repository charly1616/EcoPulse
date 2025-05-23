import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import {createDataPush,
    deleteDataPush} from "../controllers/DataPushController.js"


const router = express.Router();
router.post("/push", createDataPush)
router.delete("/delete/:id", deleteDataPush)


export default router;


