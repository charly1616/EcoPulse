import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { registerCompany, signup, confirmUser, logout, getMe, login} from "../controllers/AuthController.js"

const router = express.Router();

router.get("/confirm/:id", protectRoute, confirmUser)
router.get('/me', protectRoute, getMe)
router.post('/login', login)
router.post("/signup", signup)
router.post("/registerCompany", registerCompany)
router.post('/logout', logout)


export default router;