import React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Divider,
  Paper,
} from "@mui/material";

import { Link } from "react-router-dom";

import SideImage from "../../Components/AuthSideImage";
import Brand from "../../Components/Brand";

import './Auth.css'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export default function RegisterPage() {
    const [formData, setFormData] = useState({
		CompanyEmail: "",
		CompanyName: "",
		CompanyPassword: "",
        NIT: "",
        PostalCode: "",
	});

	const queryClient = useQueryClient();
	
	const {mutate, isError, isPending, error} = useMutation({
		mutationFn: async ({ CompanyName, CompanyEmail, CompanyPassword, NIT, PostalCode}) =>{
			try {
				const res = await fetch("/api/auth/registerCompany", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({CompanyName, CompanyEmail, CompanyPassword, NIT, PostalCode})
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Fallo al crear cuenta");
				return data;
			} catch (error) {
				console.log(error)
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Compañia registrada exitosamente");
			queryClient.invalidateQueries({queryKey: ["authUser"]})
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

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
            <Box
            component={Paper}
            square
            sx={{
                display: "flex",
                flexGrow: 10,
                flexDirection: "column",
                flex: 10,
                alignItems: "center",
            }}
            >
            <Brand/>
            {/* Lado Izquierdo - Formulario */}
            <Box
                xs={12}
                sm={8}
                md={6}
                sx={{
                display: "flex",
                flexDirection: "column",
                padding: "30px",
                maxWidth: "500px",
                }}
            >
                <Box sx={{ marginBottom: 1 }}>
                <Typography variant="h4" fontWeight="bold" mb={1}>
                    Registrar compañia
                </Typography>
                <Typography variant="body2" mb={2} sx={{ opacity: 0.6 }}>
                    Ingresa las credenciales correspondientes a la compañía.
                </Typography>
                </Box>
    
                <Box>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Nombre de compañia"
                    name="CompanyName"
                    onChange={handleInputChange}
                    value={formData.CompanyName}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Correo"
                    name="CompanyEmail"
                    type="email"
                    onChange={handleInputChange}
                    value={formData.CompanyEmail}
                />
                
                <TextField
                    margin="normal"
                    fullWidth
                    label="Contraseña"
                    type="password"
                    name="CompanyPassword"
                    onChange={handleInputChange}
                    value={formData.CompanyPassword}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Codigo NIT"
                    name="NIT"
                    type="text"
                    onChange={handleInputChange}
                    value={formData.NIT}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Codigo postal"
                    name="PostalCode"
                    type="text"
                    onChange={handleInputChange}
                    value={formData.PostalCode}
                />
    
                <Button
                    fullWidth
                    disableElevation
                    variant="contained"
                    sx={{
                    mt: 2,
                    mb: 2,
                    backgroundColor: "#f56818",
                    "&:focus": {
                        outline: "none",
                    },
                    "&.Mui-focusVisible": {
                        boxShadow: "none",
                    },
                    }}
                    onClick={handleSubmit}
                >
                    {isPending ? "Cargando..." : "Registrar"}
                </Button>
    
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    ¿Ya eres miembro? <Link to="/login">Ingresar</Link>
                </Typography>
                {isError && <p style={{color: 'red', textWrap: 'wrap', textAlign: 'center'}}>{error.message}</p>}
                </Box>
            </Box>
            </Box>
    
            <SideImage />
        </Box>
    )
}

