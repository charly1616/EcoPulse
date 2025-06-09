// src/features/building-planner/hooks/useBuildingPlannerState.js
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from '@tanstack/react-query';
import { CELL_SIZE, FACILITY_WIDTH_CELLS, FACILITY_HEIGHT_CELLS, AREA_COLORS, IconOf } from "../constants.jsx"; // Added COMPONENT_TYPES
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
  const [editingAreaId, setEditingAreaId] = useState(null);
  const [potentialNewArea, setPotentialNewArea] = useState(null);

  // New state for component dialog
  const [componentDialogOpen, setComponentDialogOpen] = useState(false);
  const [currentComponentDetails, setCurrentComponentDetails] = useState({ name: "", type: 0 }); // Default to first type
  const [potentialNewComponentLocation, setPotentialNewComponentLocation] = useState(null); // { areaId, x, y } relative to area

  const svgRef = useRef(null);

  // ... (currentFacility, currentFacilityAreas memos remain the same)
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
  }, []); 

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
      // Reset component dialog state too
      setComponentDialogOpen(false);
      setCurrentComponentDetails({ name: "", type: 0 });
      setPotentialNewComponentLocation(null);
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
        // const { id, name, areas } = updatedFacilityData; // Persist logic would go here if needed
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
  }, []);

  // ... (handleFacilityMouseMove, useEffect for mouse move remain the same)
    const handleFacilityMouseMove = useCallback(
    (e) => {
      if (addingMode === "area_end" && tempAreaStart) {
        const { x, y } = getGridCoords(e.clientX, e.clientY);
        setTempAreaEndPreview({ x, y });
      }
    },
    [addingMode, tempAreaStart, getGridCoords]
  );

  useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement && addingMode === "area_end") {
      svgElement.addEventListener("mousemove", handleFacilityMouseMove);
      return () => svgElement.removeEventListener("mousemove", handleFacilityMouseMove);
    } else if (tempAreaEndPreview && addingMode !== "area_end") {
      setTempAreaEndPreview(null);
    }
  }, [addingMode, handleFacilityMouseMove, tempAreaEndPreview]);



  //AÑADIR A LA BASE
  const { mutateAsync: createDevice } = useMutation({
  mutationFn: async ({ name, x, y, Type, consumption, areaId }) => {
    try {
      const res = await fetch("api/comp/createDevice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          Position: [x, y],
          Type: Type,ñ
          Consumption: consumption,
          AreaID: areaId,
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
  },onSuccess: () => queryClient.refetchQueries({ queryKey: ["facilitys"] })
});


  const handleFacilityCanvasClick = useCallback(async (e) => {
    if (!currentFacilityId) return;
    const { x, y } = getGridCoords(e.clientX, e.clientY);

    if (addingMode === "area_start") {
      setTempAreaStart({ x, y });
      setAddingMode("area_end");
      setTempAreaEndPreview({ x, y });
    } else if (addingMode === "area_end" && tempAreaStart) {
      const newAreaData = {
        id: uuidv4(),
        name: "",
        x: Math.min(tempAreaStart.x, x),
        y: Math.min(tempAreaStart.y, y),
        width: Math.abs(x - tempAreaStart.x) + 1,
        height: Math.abs(y - tempAreaStart.y) + 1,
        color: AREA_COLORS[currentFacilityAreas.length % AREA_COLORS.length],
        components: [],
      };
      setPotentialNewArea(newAreaData);
      setEditingAreaId(newAreaData.id);
      setCurrentAreaName("");
      setAreaNameDialogOpen(true);
      setAddingMode(null); // Exit area adding mode, user must re-initiate to add another
      setTempAreaStart(null);
      setTempAreaEndPreview(null);
    } else if (addingMode === "component" && selectedAreaId) {
      const area = currentFacilityAreas.find((s) => s.id === selectedAreaId);

      
      if (area) {
        const relX = x;
        const relY = y;

        
        if (relX >= area.x && relX < area.width + area.x && relY >= area.y && relY < area.height + area.y) {
          // Don't add component directly, open dialog
          setPotentialNewComponentLocation({ areaId: selectedAreaId, x: relX, y: relY });
          setCurrentComponentDetails({ name: "", type: 0 }); // Reset for new component
          setComponentDialogOpen(true);
          // No need to setAddingMode(null) here, dialog cancel/save will handle it or user can cancel component mode
        } else {
          console.warn("El componente está afuera del area seleccionada.");
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
  }, [currentFacilityId, getGridCoords, addingMode, tempAreaStart, currentFacilityAreas, selectedAreaId]); // Removed updateCurrentFacilityAndPersist as component add is now two-step

  const handleAreaItemClick = useCallback((areaId) => {
    if (!addingMode) {
      setSelectedAreaId(areaId);
    }
  }, [addingMode]);


  // ... (createAreaB mutation remains the same)
   const { mutateAsync: createAreaB } = useMutation({
  mutationFn: async ({ name, x, y, width, height, color }) => {
    try {
      // Crear el Map de Attributes (si no lo tienes ya)
      const attributesMap = new Map();
      attributesMap.set("Color", color); // Ejemplo: Añadir el color al Map

      // Convertir el Map a un objeto antes de enviarlo
      const attributesObject = Object.fromEntries(attributesMap);

      const res = await fetch("api/comp/createArea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: name,
          From: [x, y],
          To: [x + width, y + height],
          Attributes: attributesObject, // Enviamos el objeto, no el Map
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
  onSuccess: () => queryClient.refetchQueries({ queryKey: ["facilitys"] })
});


  const handleSaveAreaName = useCallback( async () => {
    if (!currentFacilityId) return;

    if (potentialNewArea && editingAreaId === potentialNewArea.id) {
      // Saving a new area
      // const createdArea = await createAreaB({...potentialNewArea, name: currentAreaName}); // await here
      updateCurrentFacilityAndPersist(facility => {
        const newAreaFinalized = {
          ...potentialNewArea, // id: createdArea._id, // Use ID from backend if createAreaB returns it
          name: currentAreaName || `Area ${(facility.areas || []).length + 1}`,
        };
        // Simulate backend ID for now if createAreaB is not yet fully integrated for ID return
        if (!newAreaFinalized.id) newAreaFinalized.id = uuidv4();


        // Example of calling createAreaB and updating with backend ID
        // This part is tricky because setFacilitys is sync and createAreaB is async
        // For now, let's assume the UUID is fine, and persistence happens separately or is optimistic
        createAreaB(newAreaFinalized).then(createdAreaData => {
            // If you need to update the ID in local state after creation:
            setFacilitys(prevFacilitys => prevFacilitys.map(fac => {
                if (fac.id === currentFacilityId) {
                    return {
                        ...fac,
                        areas: fac.areas.map(a => a.id === potentialNewArea.id ? {...newAreaFinalized, id: createdAreaData._id} : a)
                    }
                }
                return fac;
            }));
            setSelectedAreaId(createdAreaData._id); 
        }).catch(err => console.error("Failed to create area on backend", err));


        return { ...facility, areas: [...(facility.areas || []), newAreaFinalized] };
      });
      // setSelectedAreaId(potentialNewArea.id); // Set selected ID after optimistic update
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
    setPotentialNewArea(null);
    setEditingAreaId(null);
    setAreaNameDialogOpen(false);
  }, []);

  const handleDialogClose = useCallback(() => {
    setAreaNameDialogOpen(false);
    if (potentialNewArea) {
        cancelAddArea();
    } else {
        setEditingAreaId(null);
        setCurrentAreaName("");
    }
  }, [potentialNewArea, cancelAddArea]);


  const handleStartAddArea = useCallback(() => {
    if (!currentFacilityId) return;
    setAddingMode("area_start");
    setSelectedAreaId(null);
  }, [currentFacilityId]);


  // ... (deleteArea, handleRemoveArea, handleRenameArea, handleStartAddComponent mutations and handlers)
  const { mutateAsync: deleteArea } = useMutation({
    mutationFn: async (areaId) => {
        // ... (implementation)
        try {
            const res = await fetch(`api/comp/deleteArea/${areaId}`, { method: "DELETE" });
            let data;
            try {data = await res.json();} catch {data = { error: "Invalid server response" };}
            if (!res.ok) {throw new Error(data.error || "Error deleting area");}
            return data;
        } catch (error) { console.log("ERROR: " + error.message); throw new Error(error.message || "Unknown delete error");}
    }, onSuccess: () => queryClient.refetchQueries({ queryKey: ["facilitys"] })
    });

  const handleRemoveArea = useCallback(() => {
    if (selectedAreaId && currentFacilityId) {
        deleteArea(selectedAreaId).catch(err => console.error("Failed to delete area on backend", err));
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
        setPotentialNewArea(null);
      }
    }
  }, [selectedAreaId, currentFacilityId, currentFacilityAreas]);

  const handleStartAddComponent = useCallback(() => {
    if (selectedAreaId && currentFacilityId) {
      setAddingMode("component");
      // No longer open dialog here, just set mode
    } else {
      alert("Por favor selecciona una area para colocar tu componente");
    }
  }, [selectedAreaId, currentFacilityId]);


  const handleCancelAddComponent = useCallback(() => {
    setAddingMode(null);
    setComponentDialogOpen(false); // Close dialog if open
    setPotentialNewComponentLocation(null);
    setCurrentComponentDetails({ name: "", type: 0 });
  }, []);

  const handleSaveComponentDetails = useCallback( async () => {
    if (!currentFacilityId || !potentialNewComponentLocation) return;

    const { areaId, x, y } = potentialNewComponentLocation;
    const { name, type } = currentComponentDetails;
    //name, x, y, attributes, consumption, areaId 
    const id = await createDevice({x:x,y:y,areaId:areaId, name:name, Type: type})._id;

    const newComponent = {
      id: id,
      name: name || `Componente ${(currentFacilityAreas.find(a => a.id === areaId)?.components.length || 0) + 1}`,
      type: type, // Store the selected type ID
      x: x, // relative x
      y: y, // relative y
    };

    updateCurrentFacilityAndPersist(currentFac => ({
      ...currentFac,
      areas: currentFac.areas.map(s =>
        s.id === areaId
          ? { ...s, components: [...s.components, newComponent] }
          : s
      ),
    }));

    setComponentDialogOpen(false);
    setPotentialNewComponentLocation(null);
    setCurrentComponentDetails({ name: "", type: 0 });
    // setAddingMode(null); // Optionally exit component adding mode after adding one
  }, [currentFacilityId, potentialNewComponentLocation, currentComponentDetails, updateCurrentFacilityAndPersist, currentFacilityAreas, createDevice]);

  const handleComponentDialogClose = useCallback(() => {
    setComponentDialogOpen(false);
    setPotentialNewComponentLocation(null); // If dialog is closed, assume cancellation of this specific placement
    setCurrentComponentDetails({ name: "", type: 0 });
    // Don't necessarily reset addingMode here, user might want to click elsewhere to place component
    // Or, if a click outside an area should cancel, handle it in handleFacilityCanvasClick
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

  // ... (createFacilityB, handleAddFacility, handleFacilityTabChange mutations and handlers)
  const { mutateAsync: createFacilityB } = useMutation({
    mutationFn: async (Name) => {
        // ... (implementation)
        try {
            const res = await fetch("api/faci/create", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify({Name, CompanyID: authUser.CompanyID,}),
            });
            let data;
            try {data = await res.json();} catch {data = { error: "Invalid server response" };}
            if (!res.ok) {throw new Error(data.error || "Algo malo pasó");}
            return data;
        } catch (error) {throw new Error(error.message || "Unknown error");}
    }, onSuccess: () => queryClient.refetchQueries({ queryKey: ["facilitys"] })
    });

    const handleAddFacility = useCallback(async () => {
        try {
            const newFacilityName = `Insta ${facilitys.length + 1}`;
            const createdFacility = await createFacilityB(newFacilityName);
            const newFacility = {
            id: createdFacility._id, 
            name: createdFacility.Name,
            areas: [] // Initialize with empty areas
            };
            setFacilitys((prevFacilitys) => [...prevFacilitys, newFacility]);
            setCurrentFacilityId(newFacility.id);
        } catch (error) {
            console.error("Error creating facility:", error.message);
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
    potentialNewArea,
    editingAreaId,
    // Component Dialog State
    componentDialogOpen,
    currentComponentDetails,
    potentialNewComponentLocation, // Though not directly used by UI, good to return if needed
    svgRef,
    actions: {
      setFacilitys,
      setCurrentFacilityId,
      setSelectedAreaId,
      setAddingMode,
      setTempAreaStart,
      setTempAreaEndPreview,
      setAreaNameDialogOpen,
      setCurrentAreaName,
      setEditingAreaId,
      setPotentialNewArea,
      // Component Dialog Actions
      setComponentDialogOpen,
      setCurrentComponentDetails,
      handleSaveComponentDetails,
      handleComponentDialogClose,

      getGridCoords,
      handleFacilityCanvasClick,
      handleAreaItemClick,
      handleSaveAreaName,
      cancelAddArea,
      handleDialogClose, // This is for AreaNameDialog
      handleStartAddArea,
      handleRemoveArea,
      handleRenameArea,
      handleStartAddComponent,
      handleCancelAddComponent, // This now resets component dialog too
      handleRemoveComponent,
      handleAddFacility,
      handleFacilityTabChange,
    },
  };
}