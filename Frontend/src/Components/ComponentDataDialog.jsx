// src/features/building-planner/components/ComponentDataDialog.jsx
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { IconOf, COMPONENT_TYPES } from "../constants.jsx"; // Adjust path as needed

function ComponentDataDialog({
  open,
  onClose,
  onSave,
  componentDetails, // { name, type }
  onComponentDetailsChange, // (field, value) => void
}) {
  const handleNameChange = (event) => {
    onComponentDetailsChange("name", event.target.value);
  };

  const handleTypeChange = (event) => {
    onComponentDetailsChange("type", event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Detalles del Componente</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Ingresa un nombre y selecciona un tipo para el nuevo componente.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="componentName"
          label="Nombre del Componente"
          type="text"
          fullWidth
          variant="outlined"
          value={componentDetails.name}
          onChange={handleNameChange}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel id="component-type-label">Tipo de Componente</InputLabel>
          <Select
            labelId="component-type-label"
            id="componentType"
            value={componentDetails.type}
            onChange={handleTypeChange}
            label="Tipo de Componente"
          >
            {COMPONENT_TYPES.map((icon, id) => (
              <MenuItem key={id} value={id}>
                {React.cloneElement(icon, { style: { width: '10%', height: '10%' } })}
              </MenuItem>
            ))}

          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Guardar Componente
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ComponentDataDialog;