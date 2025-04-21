import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getCompanyUsers, getUser, blockUser, unblockUser } from '../controllers/UserController.js';

const router = express.Router();
router.get("/getUsers",protectRoute, getCompanyUsers)
router.get("/getUser/:id", getUser)
router.post("/block/:id", blockUser)
router.post("/unblock/:id", unblockUser)


export default router;