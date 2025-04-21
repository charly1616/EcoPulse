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

function LoginPage() {
  const [formData, setFormData] = useState({
    Email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ Email, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Algo malo paso",res);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
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
            paddingTop: '-20px',
            maxWidth: "500px",
            height: '100%',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h4" fontWeight="bold" mb={1}>
              Bienvenido de nuevo
            </Typography>
            <Typography variant="body2" mb={3} sx={{ opacity: 0.6 }}>
              Por favor ingresa tus credenciales
            </Typography>
          </Box>

          <Box>
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Recordar"
              />

                <Typography>
                <Link to='signup'> Forgot password </Link>
                </Typography>
              
            </Box>

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
              {isPending ? "Cargando..." : "Ingresar"}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              ¿No tienes cuenta? <Link to={'/signup'}>Crear una</Link>
            </Typography> 
            {isError && <p style={{color: 'red', textWrap: 'wrap', textAlign: 'center'}}>{error.message}</p>}
          </Box>
        </Box>
      </Box>

      <SideImage />
    </Box>
  );
}

export default LoginPage;
