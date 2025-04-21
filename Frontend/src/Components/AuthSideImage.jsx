import React from "react";
import {
  Box,
} from "@mui/material";

export default function SideImage(){
    return(
        <Box
            sx={{
                flex: 1,
            display: { xs: 'none', md: 'block' },
            backgroundColor: "#F16767",
            height: "100vh",
            width: "100%",
            flexGrow: 6
            }}
        >
            <div
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                display: "flex",
            }}
            >
            {/* Fondo con opacidad */}
                <div
                    style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: "url('/Pattern.png')",
                    backgroundSize: "250px",
                    backgroundPosition: "center",
                    opacity: 0.2,
                    zIndex: 1,
                    }}
                />

                {/* Imagen SVG encima del fondo */}
                <img
                    src="ElectricitySVG.svg"
                    alt=""
                    style={{
                    flex: 1,
                    position: "relative",
                    height: "90%",
                    zIndex: 2,
                    }}
                />
            </div>
        </Box>
    )
        
}

