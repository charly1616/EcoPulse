import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ButtonGroup,
  ListItemSecondaryAction,
  Tooltip,
  Divider,
  Tabs, // Added
  Tab, // Added
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from '@mui/icons-material/AddBox'; // Not used, can remove
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import DevicesOtherIcon from "@mui/icons-material/DevicesOther";
import AddIcon from "@mui/icons-material/Add"; // For Add Plane button
import { v4 as uuidv4 } from "uuid";

// Constants from before
const CELL_SIZE = 20;
const PLANE_WIDTH_CELLS = 46;
const PLANE_HEIGHT_CELLS = 30;
const SECTION_COLORS = [
  "rgba(255,0,0,0.3)",
  "rgba(0,255,0,0.3)",
  "rgba(0,0,255,0.3)",
  "rgba(255,255,0,0.3)",
  "rgba(0,255,255,0.3)",
  "rgba(255,0,255,0.3)",
];

// Style constants
const PAGE_BG_COLOR = "#f6f6f6";
const HEADER_BG_COLOR = "#fbfbfb";
const HEADER_TEXT_COLOR = "#525252";
const SUB_TEXT_COLOR = "#7f7f7f";

function BuildingPlannerPage() {
  // --- State for Multiple Planes ---
  const [planes, setPlanes] = useState([]); // Array of { id, name, sections: [] }
  const [currentPlaneId, setCurrentPlaneId] = useState(null);

  // --- States related to the CURRENT plane's interactions ---
  // (These will be reset when currentPlaneId changes)
  // const [sections, setSections] = useState([]); // This is now part of each plane object
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [addingMode, setAddingMode] = useState(null);
  const [tempSectionStart, setTempSectionStart] = useState(null);
  const [tempSectionEndPreview, setTempSectionEndPreview] = useState(null);

  // --- States for Dialogs (mostly related to sections of the current plane) ---
  const [sectionNameDialogOpen, setSectionNameDialogOpen] = useState(false);
  const [currentSectionName, setCurrentSectionName] = useState("");
  const [editingSectionId, setEditingSectionId] = useState(null); // For renaming or naming new section
  const [potentialNewSection, setPotentialNewSection] = useState(null); // For temporarily holding new section data before naming

  const svgRef = useRef(null);

  const planePixelWidth = PLANE_WIDTH_CELLS * CELL_SIZE;
  const planePixelHeight = PLANE_HEIGHT_CELLS * CELL_SIZE;

  // --- Derived state for the current plane and its sections ---
  const currentPlane = useMemo(
    () => planes.find((p) => p.id === currentPlaneId),
    [planes, currentPlaneId]
  );
  const currentPlaneSections = useMemo(
    () => currentPlane?.sections || [],
    [currentPlane]
  );

  // --- Initialize with a default plane on first load ---
  useEffect(() => {
    if (planes.length === 0) {
      const defaultPlaneId = uuidv4();
      const defaultPlane = {
        id: defaultPlaneId,
        name: "Insta1",
        sections: [],
      };
      setPlanes([defaultPlane]);
      setCurrentPlaneId(defaultPlaneId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on mount if planes is empty

  // --- Effect to reset interaction states when switching planes ---
  useEffect(() => {
    if (!currentPlaneId) return; // Don't reset if no plane is active (e.g., during initialization)

    setSelectedSectionId(null);
    setAddingMode(null);
    setTempSectionStart(null);
    setTempSectionEndPreview(null);
    setPotentialNewSection(null);
    setEditingSectionId(null);
    // If a dialog was open, it should naturally close or its context becomes invalid.
    // Closing it explicitly might be good if complex dialog state exists.
    setSectionNameDialogOpen(false);
  }, [currentPlaneId]);

  // --- Helper to update sections of the current plane ---
  const updateCurrentPlaneSections = useCallback(
    (updaterFn) => {
      if (!currentPlaneId) return;
      setPlanes((prevPlanes) =>
        prevPlanes.map((plane) => {
          if (plane.id === currentPlaneId) {
            return { ...plane, sections: updaterFn(plane.sections || []) };
          }
          return plane;
        })
      );
    },
    [currentPlaneId]
  );

  const getGridCoords = useCallback((clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(
        PLANE_WIDTH_CELLS - 1,
        Math.floor((clientX - rect.left) / CELL_SIZE)
      )
    );
    const y = Math.max(
      0,
      Math.min(
        PLANE_HEIGHT_CELLS - 1,
        Math.floor((clientY - rect.top) / CELL_SIZE)
      )
    );
    return { x, y };
  }, []);

  const handlePlaneMouseMove = useCallback(
    (e) => {
      if (addingMode === "section_end" && tempSectionStart) {
        const { x, y } = getGridCoords(e.clientX, e.clientY);
        setTempSectionEndPreview({ x, y });
      }
    },
    [addingMode, tempSectionStart, getGridCoords]
  );

  useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement && addingMode === "section_end") {
      svgElement.addEventListener("mousemove", handlePlaneMouseMove);
      return () => {
        svgElement.removeEventListener("mousemove", handlePlaneMouseMove);
      };
    } else if (tempSectionEndPreview) {
      setTempSectionEndPreview(null); // Clear preview if not in section_end mode
    }
  }, [addingMode, handlePlaneMouseMove, tempSectionEndPreview]);

  const handlePlaneClick = (e) => {
    if (!currentPlaneId) return; // Do nothing if no plane is active

    const { x, y } = getGridCoords(e.clientX, e.clientY);

    if (addingMode === "section_start") {
      setTempSectionStart({ x, y });
      setAddingMode("section_end");
      setTempSectionEndPreview({ x, y });
    } else if (addingMode === "section_end" && tempSectionStart) {
      const newSectionData = {
        id: uuidv4(),
        name: "",
        x: Math.min(tempSectionStart.x, x),
        y: Math.min(tempSectionStart.y, y),
        width: Math.abs(x - tempSectionStart.x) + 1,
        height: Math.abs(y - tempSectionStart.y) + 1,
        color:
          SECTION_COLORS[currentPlaneSections.length % SECTION_COLORS.length],
        components: [],
      };
      setPotentialNewSection(newSectionData);
      setEditingSectionId(newSectionData.id); // Use editingSectionId to signify which section dialog is for
      setCurrentSectionName("");
      setSectionNameDialogOpen(true);
      setAddingMode(null);
      setTempSectionStart(null);
      setTempSectionEndPreview(null);
    } else if (addingMode === "component" && selectedSectionId) {
      const section = currentPlaneSections.find(
        (s) => s.id === selectedSectionId
      );
      if (section) {
        const relX = x - section.x;
        const relY = y - section.y;
        if (
          relX >= 0 &&
          relX < section.width &&
          relY >= 0 &&
          relY < section.height
        ) {
          const newComponent = {
            id: uuidv4(),
            type: "point",
            x: relX,
            y: relY,
          };
          updateCurrentPlaneSections((prevSections) =>
            prevSections.map((s) =>
              s.id === selectedSectionId
                ? { ...s, components: [...s.components, newComponent] }
                : s
            )
          );
        } else {
          console.warn("El componente está afuera del area.");
        }
      }
      // Optionally, setAddingMode(null) here if you want to add only one component per click
    } else if (!addingMode) {
      const clickedOnEmpty = !currentPlaneSections.some(
        (s) => x >= s.x && x < s.x + s.width && y >= s.y && y < s.y + s.height
      );
      if (clickedOnEmpty) {
        setSelectedSectionId(null);
      }
    }
  };

  const handleSaveSectionName = () => {
    if (!currentPlaneId) return;

    if (potentialNewSection && editingSectionId === potentialNewSection.id) {
      updateCurrentPlaneSections((prevSections) => {
        const newSectionFinalized = {
          ...potentialNewSection,
          name: currentSectionName || `Area ${prevSections.length + 1}`,
        };
        // Set selectedSectionId outside, after the state update, to ensure it refers to the committed section
        return [...prevSections, newSectionFinalized];
      });
      setSelectedSectionId(potentialNewSection.id); // Select the newly added section
      setPotentialNewSection(null);
    } else if (editingSectionId) {
      updateCurrentPlaneSections((prevSections) =>
        prevSections.map((s) =>
          s.id === editingSectionId
            ? { ...s, name: currentSectionName || s.name }
            : s
        )
      );
    }
    setSectionNameDialogOpen(false);
    setCurrentSectionName("");
    setEditingSectionId(null);
    // setAddingMode(null); // This was already handled in handlePlaneClick or cancelAddSection
  };

  const cancelAddSection = () => {
    setAddingMode(null);
    setTempSectionStart(null);
    setTempSectionEndPreview(null);
    setPotentialNewSection(null);
    setEditingSectionId(null); // Clear editing ID if cancelling name for a new section
    setSectionNameDialogOpen(false); // Ensure dialog is closed
  };

  const handleStartAddSection = () => {
    if (!currentPlaneId) return;
    setAddingMode("section_start");
    setSelectedSectionId(null);
  };

  const handleRemoveSection = () => {
    if (selectedSectionId && currentPlaneId) {
      updateCurrentPlaneSections((prevSections) =>
        prevSections.filter((s) => s.id !== selectedSectionId)
      );
      setSelectedSectionId(null);
    }
  };

  const handleRenameSection = () => {
    if (selectedSectionId && currentPlaneId) {
      const section = currentPlaneSections.find(
        (s) => s.id === selectedSectionId
      );
      if (section) {
        setEditingSectionId(section.id);
        setCurrentSectionName(section.name);
        setSectionNameDialogOpen(true);
        setPotentialNewSection(null); // Ensure we are not in new section mode
      }
    }
  };

  const handleStartAddComponent = () => {
    if (selectedSectionId && currentPlaneId) {
      setAddingMode("component");
    } else {
      alert("Por favor selecciona una area para colocar tu componente");
    }
  };

  const handleRemoveComponent = (sectionId, componentId) => {
    if (!currentPlaneId) return;
    updateCurrentPlaneSections((prevSections) =>
      prevSections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              components: s.components.filter((c) => c.id !== componentId),
            }
          : s
      )
    );
  };

  const selectedSectionDetails = currentPlaneSections.find(
    (s) => s.id === selectedSectionId
  );

  // --- Plane Management Functions ---
  const handleAddPlane = () => {
    const newPlaneId = uuidv4();
    const newPlane = {
      id: newPlaneId,
      name: `Insta ${planes.length + 1}`,
      sections: [],
    };
    setPlanes((prevPlanes) => [...prevPlanes, newPlane]);
    setCurrentPlaneId(newPlaneId); // Switch to the new plane
  };

  const handlePlaneTabChange = (event, newValue) => {
    setCurrentPlaneId(newValue);
  };

  return (
    <Box
      bgcolor={PAGE_BG_COLOR}
      minHeight="100vh"
      sx={{ width: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* ... Header and Plane Management Bar ... UNCHANGED ... */}
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
          Building 2D Planner
        </Typography>
      </Box>

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
          value={currentPlaneId}
          onChange={handlePlaneTabChange}
          aria-label="Plane selection tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ flexGrow: 1, minHeight: "auto" }}
        >
          {planes.map((plane) => (
            <Tab
              key={plane.id}
              label={plane.name}
              value={plane.id}
              sx={{ minHeight: "auto", py: 1 }}
            />
          ))}
        </Tabs>
        <Tooltip title="Añadir nuevo plano">
          <Button
            onClick={handleAddPlane}
            variant="outlined"
            startIcon={<AddIcon />}
            size="small"
          >
            Plano
          </Button>
        </Tooltip>
      </Box>

      <Container
        maxWidth="xl"
        sx={{ flexGrow: 1, py: 3, px: { xs: 1, sm: 2, md: 3 } }}
      >
        {currentPlaneId ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              {" "}
              {/* Canvas Area - unchanged */}
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 1, sm: 2 },
                  position: "relative",
                  overflowX: "auto",
                }}
              >
                {/* SVG Content - unchanged */}
                <svg
                  ref={svgRef}
                  width={planePixelWidth}
                  height={planePixelHeight}
                  onClick={handlePlaneClick}
                  style={{
                    border: "1px solid #ddd",
                    background: "#ffffff",
                    cursor: addingMode
                      ? "crosshair"
                      : selectedSectionId
                      ? "pointer"
                      : "default",
                    display: "block",
                  }}
                >
                  {/* Grid Lines */}
                  {Array.from({ length: PLANE_WIDTH_CELLS + 1 }).map((_, i) => (
                    <line
                      key={`v-${i}`}
                      x1={i * CELL_SIZE}
                      y1={0}
                      x2={i * CELL_SIZE}
                      y2={planePixelHeight}
                      stroke="#e0e0e0"
                      strokeWidth="0.5"
                    />
                  ))}
                  {Array.from({ length: PLANE_HEIGHT_CELLS + 1 }).map(
                    (_, i) => (
                      <line
                        key={`h-${i}`}
                        x1={0}
                        y1={i * CELL_SIZE}
                        x2={planePixelWidth}
                        y2={i * CELL_SIZE}
                        stroke="#e0e0e0"
                        strokeWidth="0.5"
                      />
                    )
                  )}

                  {/* Sections for the Current Plane */}
                  {currentPlaneSections.map((section) => (
                    <g
                      key={section.id}
                      onClick={(e) => {
                        if (!addingMode) {
                          e.stopPropagation();
                          setSelectedSectionId(section.id);
                        }
                      }}
                      style={{ cursor: !addingMode ? "pointer" : "crosshair" }}
                    >
                      <rect
                        x={section.x * CELL_SIZE}
                        y={section.y * CELL_SIZE}
                        width={section.width * CELL_SIZE}
                        height={section.height * CELL_SIZE}
                        fill={section.color}
                        stroke={
                          selectedSectionId === section.id ? "blue" : "dimgray"
                        }
                        strokeWidth={selectedSectionId === section.id ? 2 : 1}
                      />
                      <text
                        x={
                          section.x * CELL_SIZE +
                          (section.width * CELL_SIZE) / 2
                        }
                        y={
                          section.y * CELL_SIZE +
                          (section.height * CELL_SIZE) / 2
                        }
                        fontSize="12px"
                        fill="#333333"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        pointerEvents="none"
                        style={{ fontWeight: 500 }}
                      >
                        {section.name}
                      </text>
                      {section.components.map(
  (comp) =>
    comp.type === "point" && (
      <g
        key={comp.id}
        transform={`translate(${(section.x + comp.x - 0.1) * CELL_SIZE}, ${
          (section.y + comp.y + 0.1) * CELL_SIZE
        }) scale(${CELL_SIZE / 800})`}
        pointerEvents="none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2C297 398 352 333.4 352 256l0-32c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"
            fill="rgba(0,0,0,0.8)"
            stroke="#ffffff"
            strokeWidth="10"
          />
        </svg>
      </g>
    )
)}

                    </g>
                  ))}
                  {/* Preview */}
                  {addingMode === "section_end" &&
                    tempSectionStart &&
                    tempSectionEndPreview && (
                      <rect
                        x={
                          Math.min(
                            tempSectionStart.x,
                            tempSectionEndPreview.x
                          ) * CELL_SIZE
                        }
                        y={
                          Math.min(
                            tempSectionStart.y,
                            tempSectionEndPreview.y
                          ) * CELL_SIZE
                        }
                        width={
                          (Math.abs(
                            tempSectionStart.x - tempSectionEndPreview.x
                          ) +
                            1) *
                          CELL_SIZE
                        }
                        height={
                          (Math.abs(
                            tempSectionStart.y - tempSectionEndPreview.y
                          ) +
                            1) *
                          CELL_SIZE
                        }
                        fill="rgba(25,118,210,0.2)"
                        stroke="rgba(25,118,210,0.6)"
                        strokeDasharray="3 3"
                        pointerEvents="none"
                      />
                    )}
                </svg>
              </Paper>
            </Grid>



            <Grid item xs={12} md={4} lg={4}>
              <Paper elevation={2} sx={{ p: 2, height: "90%" }}>
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
                      onClick={handleStartAddSection}
                      disabled={
                        addingMode === "section_start" ||
                        addingMode === "section_end" ||
                        !currentPlaneId
                      }
                      size="small"
                    >
                      Area
                    </Button>
                  </Tooltip>

                  {(addingMode === "section_start" ||
                    addingMode === "section_end") && (
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<CancelIcon />}
                      onClick={cancelAddSection}
                      size="small"
                    >
                      Cancelar
                    </Button>
                  )}
                  <ButtonGroup
                    variant="outlined"
                    disabled={
                      !selectedSectionId || !!addingMode || !currentPlaneId
                    }
                    aria-label="acciones de sección"
                    size="small"
                  >
                    <Tooltip title="Cambia el nombre de la sección seleccionada">
                      <span>
                        <Button
                          startIcon={<EditIcon />}
                          onClick={handleRenameSection}
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
                          onClick={handleRemoveSection}
                        >
                          Remover
                        </Button>
                      </span>
                    </Tooltip>
                  </ButtonGroup>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: HEADER_TEXT_COLOR }}
                >
                  Manejo de componentes
                </Typography>
                {selectedSectionId && selectedSectionDetails ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, color: SUB_TEXT_COLOR }}
                    >
                      En: <strong>{selectedSectionDetails.name}</strong>
                    </Typography>
                    {addingMode === "component" ? (
                      <Button
                        sx={{ mt: 1 }}
                        fullWidth
                        variant="outlined"
                        color="warning"
                        startIcon={<CancelIcon />}
                        onClick={() => setAddingMode(null)}
                      >
                        Cancelar
                      </Button>
                    ) : (
                      <Tooltip title="Añade un componente">
                      <span>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<DevicesOtherIcon />}
                          onClick={handleStartAddComponent}
                          disabled={!!addingMode && addingMode !== "component"}
                          fullWidth
                        >
                          Nuevo
                        </Button>
                      </span>
                    </Tooltip>
                    )}
                    {selectedSectionDetails.components.length > 0 ? (
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
                        {selectedSectionDetails.components.map((comp) => (
                          <ListItem
                            key={comp.id}
                            secondaryAction={
                              <Tooltip title="Eliminar">
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() =>
                                    handleRemoveComponent(
                                      selectedSectionId,
                                      comp.id
                                    )
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
                              primary={`Componente (${comp.x}, ${comp.y})`}
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
                    {currentPlaneId
                      ? "Selecciona una area."
                      : "Selecciona o crea un plano para empezar."}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <Typography variant="h6" color="textSecondary">
              Por favor, selecciona un plano o añade uno nuevo para empezar.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Dialog - unchanged */}
      <Dialog
        open={sectionNameDialogOpen}
        onClose={() => {
          setSectionNameDialogOpen(false);
          if (potentialNewSection) cancelAddSection();
          else {
            setEditingSectionId(null);
            setCurrentSectionName("");
          }
        }}
      >
        <DialogTitle>
          {potentialNewSection ? "Nombrar area" : "Renombrar area"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {potentialNewSection
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
            value={currentSectionName}
            onChange={(e) => setCurrentSectionName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveSectionName();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSectionNameDialogOpen(false);
              if (potentialNewSection) cancelAddSection();
              else {
                setEditingSectionId(null);
                setCurrentSectionName("");
              }
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleSaveSectionName}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BuildingPlannerPage;
