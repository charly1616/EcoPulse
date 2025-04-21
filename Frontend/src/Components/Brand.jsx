import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";

export default function Brand(){
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                paddingLeft: "50px",
                alignSelf: "start",
                alignItems: 'center', // Centra verticalmente los elementos hijos
            }}
            >
            <img src="EcoPulseLogo.png" alt="" height={50} style={{ alignSelf: 'center' }} />
            <Typography
                variant="h5"
                mb={3}
                sx={{
                ml: 1,
                color: "#f56818", // Naranja fuerte tipo brand
                fontVariant: 'small-caps',
                fontWeight: "bold",
                paddingTop: 3,
                }}
            >
                EcoPulse
            </Typography>
        </Box>
    )
}

