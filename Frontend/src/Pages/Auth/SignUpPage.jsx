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

import toast from "react-hot-toast";
import SideImage from "../../Components/AuthSideImage";
import Brand from "../../Components/Brand";

import './Auth.css'

import { useMutation, useQueryClient } from "@tanstack/react-query";


export default function SignUpPage() {
    const [formData, setFormData] = useState({
		Email: "",
		Name: "",
		CompanyEmail: "",
		password: "",
	});

	const queryClient = useQueryClient();
	
	const {mutate, isError, isPending, error} = useMutation({
		mutationFn: async ({ Email, Name, CompanyEmail, password}) =>{
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({Email, Name,CompanyEmail, password, Type: 'User'})
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
			toast.success("Cuenta creada exitosamente");
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
                      Crear cuenta
                    </Typography>
                    <Typography variant="body2" mb={3} sx={{ opacity: 0.6 }}>
                      Por favor ingresa tus credenciales
                    </Typography>
                  </Box>
        
                  <Box>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Nombre de usuario"
                      name="Name"
                      onChange={handleInputChange}
                      value={formData.Name}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Correo de Compañia"
                        name="CompanyEmail"
                        type="email"
                        onChange={handleInputChange}
                        value={formData.CompanyEmail}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Correo Electronico"
                      name="Email"
                      type="email"
                      onChange={handleInputChange}
                      value={formData.Email}
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Contraseña"
                      type="password"
                      name="password"
                      onChange={handleInputChange}
                      value={formData.password}
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
                      {isPending ? "Cargando..." : "Registrarse" }
                    </Button>
        
                    <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                      ¿Ya eres miembro? <Link to="/login">Ingresar</Link>
                    </Typography>
                    {isError && <p style={{color: 'red', textWrap: 'wrap', textAlign: 'center'}}>{error.message}</p>}
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                       <Link to="/register">Unete a nosotros</Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
        
              <SideImage />
            </Box>
    )
}

