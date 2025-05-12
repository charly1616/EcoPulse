import React from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, Avatar, IconButton, CircularProgress
} from '@mui/material';
import {
  Lock, LockOpen, PersonAdd, Edit, DeleteOutline, AdminPanelSettings, AccountCircle, CheckCircleOutline, HighlightOff // Added more icons
} from '@mui/icons-material';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// This User component will now be the display card itself, designed to be a Grid item.
export default function User({ user, onEdit, onDelete }) { // Added onEdit and onDelete props
    const queryClient = useQueryClient();

    // Mutation to confirm a user
    const { mutate: confirmUser, isPending: isConfirming } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`/api/auth/confirm/${user._id}`, { // Ensure this path is correct
                    method: "POST",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Algo salió mal al confirmar");
                toast.success(data.message || "Usuario confirmado exitosamente!");
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            // Optimistically update the local cache
            queryClient.setQueryData(["users"], (oldData) =>
                oldData.map((u) =>
                    u._id === user._id ? { ...u, Confirmed: true } : u
                )
            );
            // Or refetch to ensure consistency if optimistic update is complex
            // queryClient.invalidateQueries(["users"]);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Mutation to block/unblock a user
    const { mutate: switchBlock, isPending: isBlocking } = useMutation({
        mutationFn: async () => {
            try {
                const action = user.Blocked ? "unblock" : "block";
                const res = await fetch(`/api/users/${action}/${user._id}`, { // Ensure this path is correct
                    method: "POST",
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || `Algo salió mal al ${action === "block" ? "bloquear" : "desbloquear"}`);
                }
                toast.success(data.message || `Usuario ${action === "block" ? "bloqueado" : "desbloqueado"} exitosamente!`);
                return data.Blocked; // Assuming API returns the new Blocked status or the full user object
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: (newBlockedStatus) => { // API should ideally return the new state
            queryClient.setQueryData(["users"], (oldData) =>
                oldData.map((u) =>
                    u._id === user._id ? { ...u, Blocked: newBlockedStatus } : u
                )
            );
            // queryClient.invalidateQueries(["users"]);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleConfirm = () => {
        if (isConfirming) return;
        confirmUser();
    };

    const handleSwitchBlock = () => {
        if (isBlocking) return;
        switchBlock();
    };

    // --- Card Content ---
    const displayName = user.Name || user.username || 'Usuario Sin Nombre'; // Use user.Name
    const displayEmail = user.Email || 'No email'; // Use user.Email
    const role = user.role || 'user'; // Assuming user.role exists, otherwise default
    const profileImg = user.profileImg; // Assuming user.profileImg for avatar

    // Chip for overall status
    const statusChip = () => {
        if (!user.Confirmed) {
            return <Chip icon={<HighlightOff />} size="small" label={"No Confirmado"} color="warning" sx={{ mr: 1, mb: 1 }} />;
        } else if (user.Blocked) {
            return <Chip icon={<Lock />} size="small" label={"Bloqueado"} color="error" sx={{ mr: 1, mb: 1 }}/>;
        } else {
            return <Chip icon={<CheckCircleOutline />} size="small" label={"Activo"} color="success" sx={{ mr: 1, mb: 1 }} />;
        }
    };

    return (
        // The component itself is a Grid item, as per your original structure
        <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '80%', justifyContent: 'space-between' }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: role === 'admin' ? 'secondary.main' : 'primary.main', mr: 2, width: 40, height: 40 }}>
                            {profileImg ?
                                <img src={profileImg} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : displayName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{minWidth: 0}}> {/* Added to allow text truncation */}
                            <Typography variant="h6" component="div" noWrap title={displayName} sx={{fontSize: '1.1rem'}}>
                                {displayName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap title={displayEmail}>
                                {displayEmail}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        {statusChip()}
                        <Chip
                            icon={role === 'admin' ? <AdminPanelSettings /> : <AccountCircle />}
                            label={`Rol: ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                            size="small"
                            color={role === 'admin' ? 'secondary' : 'default'}
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, borderTop: '1px solid #eee', pt: 1.5, mt: 'auto' }}>
                    <IconButton size="small" onClick={() => onEdit(user)} title="Editar Usuario" disabled={isConfirming || isBlocking}>
                        <Edit fontSize="small" />
                    </IconButton>

                    {!user.Confirmed ? (
                        <IconButton size="small" onClick={handleConfirm} title="Confirmar Usuario" disabled={isConfirming}>
                            {isConfirming ? <CircularProgress size={20} /> : <PersonAdd fontSize="small" color="primary" />}
                        </IconButton>
                    ) : (
                        <IconButton size="small" onClick={handleSwitchBlock} title={user.Blocked ? "Desbloquear Usuario" : "Bloquear Usuario"} disabled={isBlocking}>
                            {isBlocking ? <CircularProgress size={20} /> :
                                (user.Blocked ? <LockOpen fontSize="small" color="success" /> : <Lock fontSize="small" color="warning" />)
                            }
                        </IconButton>
                    )}

                    <IconButton size="small" onClick={() => onDelete(user)} title="Eliminar Usuario" disabled={isConfirming || isBlocking}>
                        <DeleteOutline fontSize="small" color="error" />
                    </IconButton>
                </Box>
            </Paper>
        </Grid>
    );
}