// src/features/building-planner/hooks/useBuildingPlannerState.js
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from '@tanstack/react-query';
import { CELL_SIZE, FACILITY_WIDTH_CELLS, FACILITY_HEIGHT_CELLS, AREA_COLORS } from "../constants.js";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export function useBuildingPlannerState() {
  const queryClient = useQueryClient();
const authUser = queryClient.getQueryData(["authUser"]);

  const [facilitys, setFacilitys] = useState(() => {
    const v = queryClient.getQueryData(['facilitys']);
    return v ?? [];
  });


  
  const [currentFacilityId, setCurrentFacilityId] = useState(null);

  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [addingMode, setAddingMode] = useState(null); // null, "area_start", "area_end", "component"
  const [tempAreaStart, setTempAreaStart] = useState(null); // {x, y}
  const [tempAreaEndPreview, setTempAreaEndPreview] = useState(null); // {x, y}

  const [areaNameDialogOpen, setAreaNameDialogOpen] = useState(false);
  const [currentAreaName, setCurrentAreaName] = useState("");
  const [editingAreaId, setEditingAreaId] = useState(null); // ID of area being named/renamed
  const [potentialNewArea, setPotentialNewArea] = useState(null); // Full data for a area before naming

  const svgRef = useRef(null);

  const currentFacility = useMemo(
    () => facilitys.find((p) => p.id === currentFacilityId),
    [facilitys, currentFacilityId]
  );
  const currentFacilityAreas = useMemo(
    () => currentFacility?.areas || [],
    [currentFacility]
  );

  // Effect 1: Create default facility if none exist
  useEffect(() => {
    if (facilitys.length === 0) {
      const defaultFacilityId = uuidv4();
      const defaultFacility = {
        id: defaultFacilityId,
        name: "Insta1",
        areas: [],
      };
      setFacilitys([defaultFacility]);
      setCurrentFacilityId(defaultFacilityId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intencionalmente vacío para ejecutar solo al montar si `facilitys` está vacío inicialmente

  // Effect 2: Manage currentFacilityId based on facilitys array
  useEffect(() => {
    if (facilitys.length > 0) {
      if (!currentFacilityId || !(facilitys).find(f => f.id === currentFacilityId)) {
        setCurrentFacilityId(facilitys[0].id);
      }
    } else {
      if (currentFacilityId !== null) {
        setCurrentFacilityId(null);
      }
    }
  }, [facilitys, currentFacilityId]);

  // Effect 3: Reset interaction states when switching facilities
  useEffect(() => {
    if (currentFacilityId) {
      setSelectedAreaId(null);
      setAddingMode(null);
      setTempAreaStart(null);
      setTempAreaEndPreview(null);
      setPotentialNewArea(null);
      setEditingAreaId(null);
      setAreaNameDialogOpen(false);
    }
  }, [currentFacilityId]);


  const updateCurrentFacilityAndPersist = useCallback(
    (facilityUpdater) => {
      if (!currentFacilityId) return;
      let updatedFacilityData = null;
      setFacilitys((prevFacilitys) =>
        prevFacilitys.map((facility) => {
          if (facility.id === currentFacilityId) {
            updatedFacilityData = facilityUpdater(facility);
            return updatedFacilityData;
          }
          return facility;
        })
      );
      if (updatedFacilityData) {
        const { id, name, areas } = updatedFacilityData;
      }
    },
    [currentFacilityId]
  );



  const getGridCoords = useCallback((clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(FACILITY_WIDTH_CELLS - 1, Math.floor((clientX - rect.left) / CELL_SIZE))
    );
    const y = Math.max(
      0,
      Math.min(FACILITY_HEIGHT_CELLS - 1, Math.floor((clientY - rect.top) / CELL_SIZE))
    );
    return { x, y };
  }, []); // CELL_SIZE, FACILITY_WIDTH_CELLS, FACILITY_HEIGHT_CELLS are constants

  const handleFacilityMouseMove = useCallback(
    (e) => {
      if (addingMode === "area_end" && tempAreaStart) {
        const { x, y } = getGridCoords(e.clientX, e.clientY);
        setTempAreaEndPreview({ x, y });
      }
    },
    [addingMode, tempAreaStart, getGridCoords]
  );

  // Effect for mouse move on SVG for temp area preview
  useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement && addingMode === "area_end") {
      svgElement.addEventListener("mousemove", handleFacilityMouseMove);
      return () => svgElement.removeEventListener("mousemove", handleFacilityMouseMove);
    } else if (tempAreaEndPreview && addingMode !== "area_end") {
      setTempAreaEndPreview(null); // Clear preview if not in area_end mode
    }
  }, [addingMode, handleFacilityMouseMove, tempAreaEndPreview]);


  const handleFacilityCanvasClick = useCallback((e) => {
    if (!currentFacilityId) return;
    const { x, y } = getGridCoords(e.clientX, e.clientY);

    if (addingMode === "area_start") {
      setTempAreaStart({ x, y });
      setAddingMode("area_end");
      setTempAreaEndPreview({ x, y }); // Initialize preview
    } else if (addingMode === "area_end" && tempAreaStart) {
      const newAreaData = {
        id: uuidv4(),
        name: "", // To be filled by dialog
        x: Math.min(tempAreaStart.x, x),
        y: Math.min(tempAreaStart.y, y),
        width: Math.abs(x - tempAreaStart.x) + 1,
        height: Math.abs(y - tempAreaStart.y) + 1,
        color: AREA_COLORS[currentFacilityAreas.length % AREA_COLORS.length],
        components: [],
      };
      setPotentialNewArea(newAreaData);
      setEditingAreaId(newAreaData.id); // Mark this new area for naming
      setCurrentAreaName(""); // Clear name for dialog
      setAreaNameDialogOpen(true);
      setAddingMode(null);
      setTempAreaStart(null);
      setTempAreaEndPreview(null);
    } else if (addingMode === "component" && selectedAreaId) {
      const area = currentFacilityAreas.find((s) => s.id === selectedAreaId);
      if (area) {
        const relX = x - area.x;
        const relY = y - area.y;
        if (relX >= 0 && relX < area.width && relY >= 0 && relY < area.height) {
          const newComponent = { id: uuidv4(), type: "point", x: relX, y: relY };
          updateCurrentFacilityAndPersist(currentFac => ({
            ...currentFac,
            areas: currentFac.areas.map(s =>
              s.id === selectedAreaId
                ? { ...s, components: [...s.components, newComponent] }
                : s
            ),
          }));
        } else {
          console.warn("El componente está afuera del area.");
        }
      }
    } else if (!addingMode) {
      const clickedOnAnyArea = currentFacilityAreas.some(
        (s) => x >= s.x && x < s.x + s.width && y >= s.y && y < s.y + s.height
      );
      if (!clickedOnAnyArea) {
        setSelectedAreaId(null);
      }
    }
  }, [currentFacilityId, getGridCoords, addingMode, tempAreaStart, currentFacilityAreas, selectedAreaId, updateCurrentFacilityAndPersist]);

  const handleAreaItemClick = useCallback((areaId) => {
    if (!addingMode) {
      setSelectedAreaId(areaId);
    }
  }, [addingMode]);





  //AÑADIR


   const { mutateAsync: createAreaB } = useMutation({
  mutationFn: async ({name,x,y,width,height,color}) => {
    try {
      const res = await fetch("api/comp/createArea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name:name,
          From: [x,y],
          To: [x+width, y+height],
          Attributes: {Color:color},
          FacilityID: currentFacilityId,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { error: "Invalid server response" };
      }

      if (!res.ok) {
        throw new Error(data.error || "Algo malo pasó");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Unknown error");
    }
  },
});

  const handleSaveAreaName = useCallback( async () => {
    if (!currentFacilityId) return;

    if (potentialNewArea && editingAreaId === potentialNewArea.id) {
      // Saving a new area
      const createdArea = createAreaB({...potentialNewArea, name: currentAreaName});
      updateCurrentFacilityAndPersist(facility => {
        const newAreaFinalized = {
          ...potentialNewArea, id: createdArea._id,
          name: currentAreaName || `Area ${(facility.areas || []).length + 1}`,
        };
        return { ...facility, areas: [...(facility.areas || []), newAreaFinalized] };
      });
      setSelectedAreaId(potentialNewArea.id); // Auto-select new area
      setPotentialNewArea(null);
    } else if (editingAreaId) {
      // Renaming an existing area
      updateCurrentFacilityAndPersist(facility => ({
          ...facility,
          areas: (facility.areas || []).map(s =>
              s.id === editingAreaId ? { ...s, name: currentAreaName || s.name } : s
          ),
      }));
    }
    setAreaNameDialogOpen(false);
    setCurrentAreaName("");
    setEditingAreaId(null);
  }, [currentFacilityId, potentialNewArea, editingAreaId, currentAreaName, updateCurrentFacilityAndPersist, createAreaB]);

  const cancelAddArea = useCallback(() => {
    setAddingMode(null);
    setTempAreaStart(null);
    setTempAreaEndPreview(null);
    setPotentialNewArea(null); // Also clear potential new area data
    setEditingAreaId(null);
    setAreaNameDialogOpen(false); // Close dialog if it was part of add flow
  }, []);

  const handleDialogClose = useCallback(() => {
    setAreaNameDialogOpen(false);
    if (potentialNewArea) { // If closing dialog was for a new area, cancel the whole add op
        cancelAddArea();
    } else { // If it was for renaming
        setEditingAreaId(null);
        setCurrentAreaName("");
    }
  }, [potentialNewArea, cancelAddArea]);


  const handleStartAddArea = useCallback(() => {
    if (!currentFacilityId) return;
    setAddingMode("area_start");
    setSelectedAreaId(null);
  }, [currentFacilityId]);



  const { mutateAsync: deleteArea } = useMutation({
  mutationFn: async (areaId) => {
    try {
      const res = await fetch(`api/comp/deleteArea/${areaId}`, {
        method: "DELETE",
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { error: "Invalid server response" };
      }

      if (!res.ok) {
        throw new Error(data.error || "Error deleting area");
      }

      return data;
    } catch (error) {
        console.log("ERROR: " + error.message)
      throw new Error(error.message || "Unknown delete error");
    }
  },
});



  const handleRemoveArea = useCallback(() => {
    if (selectedAreaId && currentFacilityId) {
        deleteArea(selectedAreaId)
      updateCurrentFacilityAndPersist(facility => ({
          ...facility,
          areas: (facility.areas || []).filter((s) => s.id !== selectedAreaId)
      }));
      setSelectedAreaId(null);
    }
  }, [selectedAreaId, currentFacilityId, updateCurrentFacilityAndPersist, deleteArea]);

  const handleRenameArea = useCallback(() => {
    if (selectedAreaId && currentFacilityId) {
      const area = currentFacilityAreas.find((s) => s.id === selectedAreaId);
      if (area) {
        setEditingAreaId(area.id);
        setCurrentAreaName(area.name);
        setAreaNameDialogOpen(true);
        setPotentialNewArea(null); // Not a new area
      }
    }
  }, [selectedAreaId, currentFacilityId, currentFacilityAreas]);

  const handleStartAddComponent = useCallback(() => {
    if (selectedAreaId && currentFacilityId) {
      setAddingMode("component");
    } else {
      alert("Por favor selecciona una area para colocar tu componente");
    }
  }, [selectedAreaId, currentFacilityId]);

  const handleCancelAddComponent = useCallback(() => {
    setAddingMode(null);
  }, []);

  const handleRemoveComponent = useCallback((areaIdToRemoveFrom, componentId) => {
    if (!currentFacilityId || !areaIdToRemoveFrom) return;
    updateCurrentFacilityAndPersist(facility => ({
        ...facility,
        areas: (facility.areas || []).map(s =>
            s.id === areaIdToRemoveFrom
            ? { ...s, components: s.components.filter((c) => c.id !== componentId) }
            : s
        ),
    }));
  }, [currentFacilityId, updateCurrentFacilityAndPersist]);

  const selectedAreaDetails = useMemo(() =>
    currentFacilityAreas.find((s) => s.id === selectedAreaId),
    [currentFacilityAreas, selectedAreaId]
  );


  const { mutateAsync: createFacilityB } = useMutation({
  mutationFn: async (Name) => {
    try {
      const res = await fetch("api/faci/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name,
          CompanyID: authUser.CompanyID,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { error: "Invalid server response" };
      }

      if (!res.ok) {
        throw new Error(data.error || "Algo malo pasó");
      }

      return data;
    } catch (error) {
      throw new Error(error.message || "Unknown error");
    }
  },
});





  const handleAddFacility = useCallback(async () => {
  try {
    const newFacilityName = `Insta ${facilitys.length + 1}`;

    const createdFacility = await createFacilityB(newFacilityName);

    const newFacility = {
      id: createdFacility._id, // o createdFacility.data._id, si lo envolviste
      name: createdFacility.Name,
    };

    setFacilitys((prevFacilitys) => [...prevFacilitys, newFacility]);
    setCurrentFacilityId(newFacility.id);
  } catch (error) {
    console.error("Error creating facility:", error.message);
    // Puedes mostrar un toast o mensaje de error aquí si quieres
  }
}, [facilitys.length, createFacilityB]);


  const handleFacilityTabChange = useCallback((event, newValue) => {
    setCurrentFacilityId(newValue);
  }, []);


  return {
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
    potentialNewArea, // Needed for Dialog logic
    editingAreaId, // Needed for Dialog logic
    svgRef,
    actions: {
      setFacilitys, // May not be needed if mutations handle this
      setCurrentFacilityId,
      setSelectedAreaId,
      setAddingMode,
      setTempAreaStart,
      setTempAreaEndPreview,
      setAreaNameDialogOpen,
      setCurrentAreaName,
      setEditingAreaId,
      setPotentialNewArea,
      getGridCoords,
      handleFacilityCanvasClick,
      handleAreaItemClick,
      handleSaveAreaName,
      cancelAddArea,
      handleDialogClose,
      handleStartAddArea,
      handleRemoveArea,
      handleRenameArea,
      handleStartAddComponent,
      handleCancelAddComponent,
      handleRemoveComponent,
      handleAddFacility,
      handleFacilityTabChange,
    },
  };
}