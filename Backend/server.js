import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/AuthRoutes.js"
import userRoutes from "./routes/UserRoutes.js"
import facilityRoutes from "./routes/FacilityRoutes.js"
import componentsRoutes from "./routes/ComponentsRoutes.js"
import datapushRoutes from "./routes/DatapushesRoutes.js"

import connectMongoDB from "./db/connectMongoDB.js";
import path from "path";
import cookieParser from "cookie-parser"

dotenv.config();

const app = express(); 
const PORT  = process.env.PORT || 31415;
const __dirname = path.resolve(); 


app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/faci", facilityRoutes);
app.use("/api/comp", componentsRoutes);
app.use("/api/datapush", datapushRoutes)


app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`);
    connectMongoDB();
})

