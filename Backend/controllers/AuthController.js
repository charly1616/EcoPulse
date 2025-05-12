
import {generateTokenAndSetCookie} from '../utils/generateToken.js';
import User from "../models/user_model.js";
import Company from '../models/company_model.js';
import bcrypt from "bcryptjs";
import { sendConfirmationEmail } from '../utils/sendConfirmationEmail.js';
import Mongoose from 'mongoose'


// FUNCION PARA HACER EL LOGIN
export const login = async (req, res) => {
    try {
        const {Email, password} = req.body;
        const user = await User.findOne({Email});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        const isUserBlocked = user?.Blocked;
        const isConfirmed = user?.Confirmed;
        if (!user || !isPasswordCorrect){
            console.log(user)
            return res.status(400).json({error: "Correo o contraseña invalido"})
        } else if (isUserBlocked){
            return res.status(400).json({error: "Usuario está bloqueado"})
        } else if (!isConfirmed){
            return res.status(400).json({error: "Usuario no ha sido confirmado aun"})
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            Name: user.Name,
            Email: user.Email,
            Type: user.Type,
            CompanyID: user.CompanyID
        })

    } catch (error) {
        console.log("Error en el controlador de login", error.message, req);
        res.status(500).json({error:"Error interno del servidor"})
    }
}


// FUNCION PARA OBTENER LOS DATOS DEL USUARIO
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user)
    } catch (error) {
        console.log("Error en el controlador de GetMe ", error.message,req);
        res.status(500).json({error: "Error de servidor interno " + req})
    }
}


// FUNCION PARA CERRAR SESION
export const logout = async (req, res) =>{
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({message: "Se cerro sesion exitosamente"})
    } catch (error) {
        console.log("Error en el controlador del error", error.message);
        res.status(500).json({error: "Error del servidor interno"})
    }
}


// FUNCION PARA CONFIRMAR UN USUARIO
export const confirmUser = async (req, res) => {
    try {
        const UserID = req.params.id;
        let user = await User.findById(UserID);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        
        if (user){
            user.Confirmed = true
            user = await user.save()
            return res.status(200).json({message: "Usuario confirmado exitosamente"});
        } else {
            return res.status(400).json({error:"Error al confirmar, el usuario no existe"});
        }
        

    } catch (error) {
        console.log("Error en el controlador de confirmación ", error.message);
        res.status(500).json({error: "Error interno del servidor"});
    }
}

// FUNCION PARA REGISTRARSE COMO USUARIO
export const signup = async (req, res) =>{
    try {
        const {Name, Email, password, CompanyEmail, Type} = req.body;
        const compa = await Company.findOne({CompanyEmail:CompanyEmail})
        console.log("COMPAÑIA ENCONTRADA ",compa)
        if (!compa) {
            return res.status(400).json({error:`No existe compañia con ese correo`})
        }
        const companyID = compa._id
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(Email)){
            console.log(req.body)
            return res.status(400).json({error:`Formato de email invalido ${req.body}`})
        }

        const existingEmail = await User.findOne({Email});
        if (existingEmail){
            return res.status(400).json({error:"Ya existe un email similar"});
        }

        if (password.length < 6){
            return res.status(400).json({error:"Contraseña es muy corta"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            Name,
            Email,
            Type,
            password: hashedPassword,
            CompanyID: new Mongoose.Types.ObjectId(companyID),
            Confirmed: false,
        })

        if (newUser){
            await newUser.save();
            res.status(201).json({
				_id: newUser._id,
                Name: newUser.Name,
                Email: newUser.Email,
                Type: newUser.Type,
                CompanyID: newUser.CompanyID
			});
        } else {
            res.status(400).json({error:"Error al crear el usuario"});
        }
    } catch (error) {
        console.log("Error en el controlador de registro ", error.message);
        res.status(500).json({error: "Error interno del servidor"});
    }
}


// FUNCION PARA REGISTRAR LA COMPAÑIA
export const registerCompany = async (req, res) => {
    try {
        const {CompanyName, CompanyEmail, CompanyPassword, NIT, PostalCode} = req.body;
        const companyWithName = await Company.findOne({CompanyName})
        const isPasswordCorrect = CompanyPassword.length >= 6
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(CompanyEmail)) return res.status(400).json({error: "Correo invalido"})
        if (!isPasswordCorrect) return res.status(400).json({error: "La constraseña es muy corta"})
        if (companyWithName) return res.status(400).json({error: "Ya existe una compañia con el mismo nombre" + companyWithName})


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(CompanyPassword, salt)



        const newCompany = new Company({
            CompanyName,
            CompanyEmail,
            NIT,
            PostalCode,
            CompanyPassword: hashedPassword,
        })
        

        if (newCompany){
            //Crear el administrador de compañia
            const newCompanyUser = new User({
                Name: CompanyName+"-Admin",
                Email: CompanyEmail,
                password: hashedPassword,
                Type: "Admin",
                CompanyID: newCompany._id,
            })
            //Generar la cookie
            generateTokenAndSetCookie(newCompanyUser._id, res)
            //Guardar la compañia
            await newCompany.save()
            
            
            //Enviar un correo de confirmación para crear el usuario
            sendConfirmationEmail("dummycharlyb@gmail.com", process.env.CONFIRMATION_ENDPOINT, CompanyName)//newCompanyUser._id)
            await newCompanyUser.save()
            //Devolver el usuario
            res.status(201).json({
				_id: newCompanyUser._id,
                Name: newCompanyUser.Name,
                Email: newCompanyUser.Email,
                Type: newCompanyUser.Type,
                CompanyID: newCompanyUser.CompanyID
			});
        } else {
            res.status(400).json({error: "No se pudo crear la compañia"});
        }
    } catch (error) {
        console.log("Error en el controlador de registro de compañia ", error.message);
        res.status(500).json({error: "Error interno del servidor"});
    }
}




