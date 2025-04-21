import React from "react";
import SideBar from "../../Components/SideBar.jsx";
import { Box } from "@mui/material";
import { useState } from "react";
import Dashboard from "./Dashboard.jsx";
import ManageUser from "./ManageUser.jsx";
import DataPushes from "./DataPushes.jsx";

export default function HomePage() {
    const [vistaSeleccionada, setVistaSeleccionada] = useState('dashboard');

    return (
        <Box
            component="main"
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
            }}
            >
            <SideBar onSeleccionarVista={setVistaSeleccionada}/>

            {vistaSeleccionada === 'dashboard' && <Dashboard/>}
            {vistaSeleccionada === 'manageUser' && <ManageUser/>}
            {vistaSeleccionada === 'datapushes' && <DataPushes/>}
        </Box>
    )
}
