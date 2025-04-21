import {generateTokenAndSetCookie} from '../utils/generateToken.js';
import User from "../models/user_model.js";
import Company from '../models/company_model.js';
import bcrypt from "bcryptjs";
import { sendConfirmationEmail } from '../utils/sendConfirmationEmail.js';
import Mongoose from 'mongoose'



export const getCompanyUsers = async (req, res) => {
    try {
        const { CompanyID, Type } = req.user;
        if (Type !== "Admin") return res.status(401).json({ message: "No tienes permisos para ver los usuarios" });
        const company = await Company.findById(CompanyID);
        if (!company) return res.status(404).json({ message: "Compañia invalida" });
        const users = await User.find({ CompanyID: CompanyID });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error en obtener todos los usuarios" + error.message });
    }
}


export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) return res.status(404).json({ message: "No se encontró usuario" });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error en obtener usuario" + error.message });
    }
}

export const blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "No se encontró usuario" });
        user.Blocked = true;
        await user.save();
        res.status(200).json({ Blocked: true });
    }
    catch (error) {
        res.status(500).json({ message: "Error en bloquear usuario" + error.message });
    }
}

export const unblockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "No se encontró usuario" });
        user.Blocked = false;
        await user.save();
        res.status(200).json({ Blocked: false });
    }
    catch (error) {
        res.status(500).json({ message: "Error en bloquear usuario" + error.message });
    }
}

