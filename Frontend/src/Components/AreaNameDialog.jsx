// src/features/building-planner/components/AreaNameDialog.jsx
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

function AreaNameDialog({
  open,
  onClose, // General close handler
  onSave,
  isNewArea, // boolean: true if naming a potential new area
  areaName,
  onAreaNameChange,
}) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isNewArea ? "Nombrar area" : "Renombrar area"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isNewArea
            ? "Ingresa el nombre para la nueva area."
            : "Ingresa el nuevo nombre para el area."}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Nombre del Area"
          type="text"
          fullWidth
          variant="standard"
          value={areaName}
          onChange={(e) => onAreaNameChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(AreaNameDialog);