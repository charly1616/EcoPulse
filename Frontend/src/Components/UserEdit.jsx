import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip
} from '@mui/material';
import { Lock, LockOpen, PersonAdd } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";


export default function User({user}){
    const queryClient = useQueryClient();

    const {mutate: confirmUser, isPending: isConfirming} = useMutation({
        mutationFn: async () => {
            try {
				const res = await fetch("/api/auth/confirm/"+user._id, {
                    method: "POST",
                });
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Algo salio mal");
				return data;
			} catch (error) {
				throw new Error(error);
			}
        }, onSuccess: () => {
            queryClient.setQueryData(["users"], (olData) => {
                return olData.map((p) => {
                    if (p._id === user._id) {
                        return { ...p, Confirmed: true };
                    }
                    return p;
                })
            })
        },onError: (error) => {
            toast.error(error.message);
        },
    })

    const { mutate: switchBlock, isPending: isBlocking } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/users/${user.Blocked? "unblock" : "block"}/${user._id}`, {
                    method: "POST",
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Algo malo paso");
                }
                return data
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: (Blocked) => {
            queryClient.setQueryData(["users"], (olData) => {
                return olData.map((p) => {
                    if (p._id === user._id) {
                        return { ...p, Blocked: Blocked };
                    }
                    return p;
                })
            })
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    



    const handleConfirm = () => {
        if (isConfirming) return
        confirmUser();
      }

    const renderAcciones = (user) => {
        if (!user.Confirmed) {
          return (
            <Button size="small"
              startIcon={<PersonAdd />}
              variant="contained"
              color="primary"
              onClick={handleConfirm}
            >
              {isConfirming ? "Confirmando..." : "Confirmar"}
            </Button>
          );
        } else if (!user.Blocked) {
          return (
            <Button size="small"
              startIcon={<Lock />}
              variant="outlined"
              color="error"
              onClick={switchBlock}
            >
              {isBlocking ? "Bloqueando..." : "Bloquear"}
            </Button>
          );
        } else if (user.Blocked) {
          return (
            <Button size="small"
              startIcon={<LockOpen />}
              variant="outlined"
              color="success"
              onClick={switchBlock}
            >
              {isBlocking ? "Desbloqueando..." : "Desbloquear"}
            </Button>
          );
        }
      };
      

      const chipState = () => {
        if (!user.Confirmed) {
          return <Chip size="small" label={"No Confirmado"} color="error" />;
        } else if (user.Blocked) {
          return <Chip size="small" label={"Bloqueado"} color="error" />;
        } else {
          return <Chip size="small" label={"Activo"} color="success" />;
        }
      };

      
       

    return (
            <Grid xs={12} sm={6} md={4} key={user.id}>
            <Paper elevation={2} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h6">{user.Name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.Email}</Typography>
              {chipState()}
              <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                {renderAcciones(user)}
              </Box>
            </Paper>
          </Grid>
    )

}

