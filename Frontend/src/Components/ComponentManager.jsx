// src/features/building-planner/components/ComponentManager.jsx
import React from "react";
import {
  Typography,
  Button,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import { HEADER_TEXT_COLOR, SUB_TEXT_COLOR } from "../constants";

function ComponentManager({
  selectedAreaId,
  selectedAreaDetails,
  addingMode,
  currentFacilityId,
  onStartAddComponent,
  onCancelAddComponent,
  onRemoveComponent,
}) {
  const componentControlsDisabled = !selectedAreaId || (!!addingMode && addingMode !== "component") || !currentFacilityId;

  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: HEADER_TEXT_COLOR }}
      >
        Manejo de componentes
      </Typography>
      {selectedAreaId && selectedAreaDetails ? (
        <>
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, color: SUB_TEXT_COLOR }}
          >
            En: <strong>{selectedAreaDetails.name}</strong>
          </Typography>
          {addingMode === "component" ? (
            <Button
              sx={{ mt: 1 }}
              fullWidth
              variant="outlined"
              color="warning"
              startIcon={<CancelIcon />}
              onClick={onCancelAddComponent} // Updated to use specific cancel handler
            >
              Cancelar Componente
            </Button>
          ) : (
            <Tooltip title="Añade un componente">
              <span>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DevicesOtherIcon />}
                  onClick={onStartAddComponent}
                  disabled={componentControlsDisabled}
                  fullWidth
                >
                  Nuevo
                </Button>
              </span>
            </Tooltip>
          )}
          {selectedAreaDetails.components.length > 0 ? (
            <List
              dense
              sx={{
                maxHeight: "200px",
                overflowY: "auto",
                mt: 1.5,
                backgroundColor: "#fafafa",
                borderRadius: 1,
                height: "1000px"
              }}
            >
              {selectedAreaDetails.components.map((comp) => (
                <ListItem
                  key={comp.id}
                  secondaryAction={
                    <Tooltip title="Eliminar">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() =>
                          onRemoveComponent(selectedAreaId, comp.id)
                        }
                        disabled={!!addingMode}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ borderBottom: "1px solid #eee" }}
                >
                  <ListItemText
                    primary={comp.name}
                    primaryTypographyProps={{ fontSize: "0.875rem" }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              sx={{
                mt: 1.5,
                fontStyle: "italic",
                color: SUB_TEXT_COLOR,
              }}
            >
              No hay componentes.
            </Typography>
          )}
        </>
      ) : (
        <Typography
          sx={{ mt: 1.5, fontStyle: "italic", color: SUB_TEXT_COLOR }}
        >
          {currentFacilityId
            ? "Selecciona una area."
            : "Selecciona o crea un plano para empezar."}
        </Typography>
      )}
    </>
  );
}

export default React.memo(ComponentManager);