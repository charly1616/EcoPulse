// src/features/building-planner/components/FacilityTabs.jsx
import React from "react";
import { Box, Tabs, Tab, Button, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { HEADER_BG_COLOR } from "../constants.jsx";

function FacilityTabs({
  facilitys,
  currentFacilityId,
  onTabChange,
  onAddFacility,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: HEADER_BG_COLOR,
        px: { xs: 1, sm: 2 },
        py: 1,
      }}
    >
      <Tabs
        value={currentFacilityId || false}
        onChange={onTabChange}
        aria-label="Facility selection tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ flexGrow: 1, minHeight: "auto" }}
      >
        {facilitys.map((facility) => (
          <Tab
            key={facility.id}
            label={facility.name}
            value={facility.id}
            sx={{ minHeight: "auto", py: 1 }}
          />
        ))}
      </Tabs>
      <Tooltip title="Añadir nuevo plano">
        <Button
          onClick={onAddFacility}
          variant="outlined"
          startIcon={<AddIcon />}
          size="small"
        >
          Plano
        </Button>
      </Tooltip>
    </Box>
  );
}

export default React.memo(FacilityTabs);