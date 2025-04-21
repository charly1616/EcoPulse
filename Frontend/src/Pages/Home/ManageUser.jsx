import React, { useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip
} from '@mui/material';
import { Lock, LockOpen, PersonAdd } from '@mui/icons-material';


import { useQuery, useQueryClient } from "@tanstack/react-query";
import User from '../../Components/UserEdit';

const ManageUser = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: users, isLoading,
      refetch,
      isRefetching,}
      = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/getUsers");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Algo salio mal");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		}
	});
  

  useEffect(()=>{
      refetch();
    }, [refetch])

  return (
    <Box bgcolor="#f6f6f6" minHeight="100vh" sx={{width: "100vw", height: "100vh", gap: 3, display: 'flex', flexDirection: 'column' , padding: 4, paddingInline: 12}}>
      <Typography variant="h5" gutterBottom sx={{ color: '#7f7f7f'}}>
        Gestión de Usuarios de la Compañía
      </Typography>
      <Grid container spacing={3}>
        {users? users.map(user => (
          (user._id !== authUser._id) ? <User key={user._id} user={user}/> : <></>
        )): "No hay usuarios"}
      </Grid>
    </Box>
  );
};

export default ManageUser;
