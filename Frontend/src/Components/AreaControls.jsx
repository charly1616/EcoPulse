// src/features/building-planner/components/AreaControls.jsx
import React from "react";
import {
  Typography,
  Button,
  Box,
  ButtonGroup,
  Tooltip,
  Divider,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { HEADER_TEXT_COLOR } from "../constants.js";

function AreaControls({
  addingMode,
  currentFacilityId,
  selectedAreaId,
  onStartAddArea,
  onCancelAddArea,
  onRenameArea,
  onRemoveArea,
}) {
  const isAddingArea = addingMode === "area_start" || addingMode === "area_end";
  const controlsDisabled = !selectedAreaId || !!addingMode || !currentFacilityId;

  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: HEADER_TEXT_COLOR }}
      >
        Control de areas
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        flexWrap="wrap"
        sx={{ mb: 1.5 }}
      >
        <Tooltip title="Define una nueva area">
          <Button
            variant="contained"
            startIcon={<AddBoxIcon />}
            onClick={onStartAddArea}
            disabled={isAddingArea || !currentFacilityId}
            size="small"
          >
            Area
          </Button>
        </Tooltip>

        {isAddingArea && (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<CancelIcon />}
            onClick={onCancelAddArea}
            size="small"
          >
            Cancelar
          </Button>
        )}
        <ButtonGroup
          variant="outlined"
          disabled={controlsDisabled}
          aria-label="acciones de sección"
          size="small"
        >
          <Tooltip title="Cambia el nombre de la sección seleccionada">
            <span>
              <Button
                startIcon={<EditIcon />}
                onClick={onRenameArea}
                disabled={controlsDisabled}
              >
                Renombrar
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Elimina la seccion seleccionada">
            <span>
              <Button
                color="error"
                startIcon={<RemoveCircleOutlineIcon />}
                onClick={onRemoveArea}
                disabled={controlsDisabled}
              >
                Remover
              </Button>
            </span>
          </Tooltip>
        </ButtonGroup>
      </Box>
      <Divider sx={{ my: 2.5 }} />
    </>
  );
}
export default React.memo(AreaControls);