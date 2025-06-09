// src/features/building-planner/BuildingPlannerPage.jsx
import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";

// Suponiendo que FacilityCanvas.jsx está en el mismo directorio o ajusta la ruta
import FacilityCanvas from "../../Components/FacilityCanvas.jsx"; 
import { useBuildingPlannerState } from "../../Hooks/useBuildingPlannerState"; // Ajusta ruta
import FacilityTabs from "../../Components/FacilityTabs.jsx"; // Ajusta ruta
import AreaControls from "../../Components/AreaControls.jsx"; // Ajusta ruta
import ComponentManager from "../../Components/ComponentManager.jsx"; // Ajusta ruta
import AreaNameDialog from "../../Components/AreaNameDialog.jsx"; // Ajusta ruta

// ... (other imports)
import ComponentDataDialog from "../../Components/ComponentDataDialog.jsx"; // Adjust path
import { COMPONENT_TYPES } from "../../constants.jsx"; // Adjust path

import {
  PAGE_BG_COLOR,
  HEADER_BG_COLOR,
  HEADER_TEXT_COLOR,
  SUB_TEXT_COLOR,
  FACILITY_PIXEL_WIDTH,
  FACILITY_PIXEL_HEIGHT,
  CELL_SIZE,
  FACILITY_WIDTH_CELLS,
  FACILITY_HEIGHT_CELLS,

} from "../../constants.jsx"

function BuildingPlannerPage() {
  const {
    facilitys,
    currentFacilityId,
    currentFacility,
    currentFacilityAreas,
    selectedAreaId,
    selectedAreaDetails,
    addingMode,
    tempAreaStart,
    tempAreaEndPreview,
    areaNameDialogOpen,
    currentAreaName,
    potentialNewArea,
    // Component Dialog state from hook
    componentDialogOpen,
    currentComponentDetails,
    svgRef,
    actions,
  } = useBuildingPlannerState();

  const handleComponentDetailsChange = (field, value) => {
    actions.setCurrentComponentDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box
      bgcolor={PAGE_BG_COLOR}
      minHeight="100vh"
      sx={{ width: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* ... (Header, FacilityTabs) ... */}
      <Box
        sx={{
          padding: 2,
          backgroundColor: HEADER_BG_COLOR,
          paddingInline: { xs: 2, sm: 4 },
          boxShadow: 1,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: HEADER_TEXT_COLOR, mb: 0 }}
        >
          Plano de las instalaciones
        </Typography>
      </Box>

      <FacilityTabs
        facilitys={facilitys}
        currentFacilityId={currentFacilityId}
        onTabChange={actions.handleFacilityTabChange}
        onAddFacility={actions.handleAddFacility}
      />


      <Container
        maxWidth="xl"
        sx={{ flexGrow: 1, py: 3, px: { xs: 1, sm: 2, md: 3 } }}
      >
        {currentFacilityId && currentFacility ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 1, sm: 2 },
                  position: "relative",
                  overflowX: "auto",
                }}
              >
                <FacilityCanvas
                  ref={svgRef}
                  canvasWidth={FACILITY_PIXEL_WIDTH}
                  canvasHeight={FACILITY_PIXEL_HEIGHT}
                  cellSize={CELL_SIZE}
                  gridWidthCells={FACILITY_WIDTH_CELLS}
                  gridHeightCells={FACILITY_HEIGHT_CELLS}
                  areas={currentFacilityAreas}
                  selectedAreaId={selectedAreaId}
                  addingMode={addingMode}
                  tempAreaStart={tempAreaStart}
                  tempAreaEndPreview={tempAreaEndPreview}
                  onCanvasClick={actions.handleFacilityCanvasClick}
                  onAreaItemClick={actions.handleAreaItemClick}
                  // Pass component types if FacilityCanvas needs to render different icons
                  // componentTypes={COMPONENT_TYPES} 
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
                <AreaControls
                  addingMode={addingMode}
                  currentFacilityId={currentFacilityId}
                  selectedAreaId={selectedAreaId}
                  onStartAddArea={actions.handleStartAddArea}
                  onCancelAddArea={actions.cancelAddArea}
                  onRenameArea={actions.handleRenameArea}
                  onRemoveArea={actions.handleRemoveArea}
                />
                <ComponentManager
                  selectedAreaId={selectedAreaId}
                  selectedAreaDetails={selectedAreaDetails}
                  addingMode={addingMode}
                  currentFacilityId={currentFacilityId}
                  onStartAddComponent={actions.handleStartAddComponent}
                  onCancelAddComponent={actions.handleCancelAddComponent}
                  onRemoveComponent={actions.handleRemoveComponent}
                  // Pass component types if Manager needs to display type names
                  componentTypes={COMPONENT_TYPES} 
                />
              </Paper>
            </Grid>
          </Grid>
        ) : (
          // ... (No facility selected message) ...
           <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <Typography variant="h6" color="textSecondary">
              {facilitys.length > 0
                ? "Por favor, selecciona un plano."
                : "Por favor, añade un nuevo plano para empezar."}
            </Typography>
          </Box>
        )}
      </Container>

      <AreaNameDialog
        open={areaNameDialogOpen}
        onClose={actions.handleDialogClose}
        onSave={actions.handleSaveAreaName}
        isNewArea={!!potentialNewArea}
        areaName={currentAreaName}
        onAreaNameChange={(name) => actions.setCurrentAreaName(name)} // Simpler change for direct value
      />

      {/* New Component Dialog */}
      <ComponentDataDialog
        open={componentDialogOpen}
        onClose={actions.handleComponentDialogClose}
        onSave={actions.handleSaveComponentDetails}
        componentDetails={currentComponentDetails}
        onComponentDetailsChange={handleComponentDetailsChange}
      />
    </Box>
  );
}

export default BuildingPlannerPage;