// src/features/building-planner/components/ComponentManager.jsx
import React from "react";
import {
  Typography,
  Button,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon, // Still needed
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
// Assuming constants.js is in ../constants.jsx relative to this file, adjust if needed
// COMPONENT_TYPES is now an array of JSX SVG elements, e.g., [<svg ... />, <svg ... />]
import { HEADER_TEXT_COLOR, SUB_TEXT_COLOR, COMPONENT_TYPES } from "../constants.jsx";

function ComponentManager({
  selectedAreaId,
  selectedAreaDetails,
  addingMode,
  currentFacilityId,
  onStartAddComponent,
  onCancelAddComponent,
  onRemoveComponent,
}) {
  const componentControlsDisabled =
    !selectedAreaId ||
    (!!addingMode && addingMode !== "component") ||
    !currentFacilityId;

  // comp.type will be the index for the COMPONENT_TYPES array.
  // There's no separate 'name' for the type directly in the COMPONENT_TYPES array.
  // We can use a generic name or rely on comp.name being descriptive enough.

  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: HEADER_TEXT_COLOR, mt: 2 }}
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
              onClick={onCancelAddComponent}
            >
              Cancelar Añadir Componente
            </Button>
          ) : (
            <Tooltip
              title={
                componentControlsDisabled
                  ? selectedAreaId
                    ? "Otra acción en progreso"
                    : "Selecciona un área primero"
                  : "Añade un componente al área seleccionada"
              }
            >
              <span>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DevicesOtherIcon />}
                  onClick={onStartAddComponent}
                  disabled={componentControlsDisabled}
                  fullWidth
                >
                  Nuevo Componente
                </Button>
              </span>
            </Tooltip>
          )}
          {selectedAreaDetails.components &&
          selectedAreaDetails.components.length > 0 ? (
            <List
              dense
              sx={{
                maxHeight: "200px",
                overflowY: "auto",
                mt: 1.5,
                backgroundColor: "#fafafa",
                borderRadius: 1,
              }}
            >
              {selectedAreaDetails.components.map((comp) => {
                // comp.type is the index into the COMPONENT_TYPES array
                const IconSvgElement = COMPONENT_TYPES[comp.type];

                

                return (
                  <ListItem
                    key={comp.id}
                    secondaryAction={
                      <Tooltip title="Eliminar componente">
                        <IconButton
                          edge="end"
                          aria-label="delete component"
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
                    {IconSvgElement && (
                      <ListItemIcon
                        sx={{
                          minWidth: "auto",
                          marginRight: 1.5,
                          display: "flex",
                          alignItems: "center",
                          // You might need to style the SVG if it doesn't have intrinsic size
                          // or if you want to ensure consistency.
                          "& svg": {
                            width: "20px", // Example size
                            height: "20px", // Example size
                            fill: "currentColor", // Example fill
                          },
                        }}
                      >
                        {/* Render the SVG JSX element directly */}
                        {IconSvgElement}
                      </ListItemIcon>
                    )}
                    <ListItemText
                      primary={comp.name}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: "medium",
                      }}
                      secondaryTypographyProps={{
                        fontSize: "0.75rem",
                        color: "text.secondary",
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography
              sx={{
                mt: 1.5,
                fontStyle: "italic",
                color: SUB_TEXT_COLOR,
              }}
            >
              No hay componentes en esta área.
            </Typography>
          )}
        </>
      ) : (
        <Typography
          sx={{ mt: 1.5, fontStyle: "italic", color: SUB_TEXT_COLOR }}
        >
          {currentFacilityId
            ? "Selecciona una area para manejar sus componentes."
            : "Selecciona o crea un plano para empezar."}
        </Typography>
      )}
    </>
  );
}

export default React.memo(ComponentManager);