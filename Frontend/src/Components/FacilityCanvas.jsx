// FacilityCanvas.jsx (NO CHANGES from the previous good version)
import React from "react";

const ICONS = [
    (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"> <path d="M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2C297 398 352 333.4 352 256l0-32c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z" fill="rgba(0,0,0,0.8)" stroke="#ffffff" strokeWidth="10"/> </svg>)
  , (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"> <path d="M384 96l0 224L64 320 64 96l320 0zM64 32C28.7 32 0 60.7 0 96L0 320c0 35.3 28.7 64 64 64l117.3 0-10.7 32L96 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-74.7 0-10.7-32L384 384c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L64 32zm464 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0zm16 64l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm-16 80c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm32 160a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>)
  , (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"> <path d="M128 32C92.7 32 64 60.7 64 96l0 256 64 0 0-256 384 0 0 256 64 0 0-256c0-35.3-28.7-64-64-64L128 32zM19.2 384C8.6 384 0 392.6 0 403.2C0 445.6 34.4 480 76.8 480l486.4 0c42.4 0 76.8-34.4 76.8-76.8c0-10.6-8.6-19.2-19.2-19.2L19.2 384z"/></svg>)
  , (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path d="M128 0C92.7 0 64 28.7 64 64l0 96 64 0 0-96 226.7 0L384 93.3l0 66.7 64 0 0-66.7c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0L128 0zM384 352l0 32 0 64-256 0 0-64 0-16 0-16 256 0zm64 32l32 0c17.7 0 32-14.3 32-32l0-96c0-35.3-28.7-64-64-64L64 192c-35.3 0-64 28.7-64 64l0 96c0 17.7 14.3 32 32 32l32 0 0 64c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-64zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>)
  , (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path d="M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>)
  , (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"> <path d="M64 64l0 288 512 0 0-288L64 64zM0 64C0 28.7 28.7 0 64 0L576 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 416c-35.3 0-64-28.7-64-64L0 64zM128 448l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-384 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>)
  , (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path d="M258.6 0c-1.7 0-3.4 .1-5.1 .5C168 17 115.6 102.3 130.5 189.3c2.9 17 8.4 32.9 15.9 47.4L32 224l-2.6 0C13.2 224 0 237.2 0 253.4c0 1.7 .1 3.4 .5 5.1C17 344 102.3 396.4 189.3 381.5c17-2.9 32.9-8.4 47.4-15.9L224 480l0 2.6c0 16.2 13.2 29.4 29.4 29.4c1.7 0 3.4-.1 5.1-.5C344 495 396.4 409.7 381.5 322.7c-2.9-17-8.4-32.9-15.9-47.4L480 288l2.6 0c16.2 0 29.4-13.2 29.4-29.4c0-1.7-.1-3.4-.5-5.1C495 168 409.7 115.6 322.7 130.5c-17 2.9-32.9 8.4-47.4 15.9L288 32l0-2.6C288 13.2 274.8 0 258.6 0zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>)
]


//Enchufe
//CompuMesa
//Laptop
//Impresora
//Servidor
//Tv
//Air conditioning

const IconOf = (v) => {
  if (v >= ICONS.length) v=0;
  return ICONS[v]
} 



const FacilityCanvas = React.forwardRef((props, ref) => {
  const {
    canvasWidth,
    canvasHeight,
    cellSize,
    gridWidthCells,
    gridHeightCells,
    areas,
    selectedAreaId,
    addingMode,
    tempAreaStart,
    tempAreaEndPreview,
    onCanvasClick,
    onAreaItemClick,
  } = props;

  return (
    <svg
      ref={ref}
      width={canvasWidth}
      height={canvasHeight}
      onClick={onCanvasClick} // For clicks on empty canvas or during add modes
      style={{
        border: "1px solid #ddd",
        background: "#ffffff",
        cursor: addingMode
          ? "crosshair"
          : selectedAreaId // If a area is selected, items are pointer
          ? "pointer"
          : "default", // Default for empty canvas
        display: "block",
      }}
    >
      {/* Grid Lines */}
      {Array.from({ length: gridWidthCells + 1 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * cellSize}
          y1={0}
          x2={i * cellSize}
          y2={canvasHeight}
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: gridHeightCells + 1 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={0}
          y1={i * cellSize}
          x2={canvasWidth}
          y2={i * cellSize}
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      ))}

      {/* Areas */}
      {(areas ?? []).map((area) => (
        <g
          key={area.id}
          onClick={(e) => {
            if (!addingMode) {
              e.stopPropagation(); // VERY IMPORTANT: Prevent onCanvasClick from firing when a area item is clicked
              onAreaItemClick(area.id); // Notify parent to select this area
            }
            // If in addingMode, the main onCanvasClick on SVG will handle it
          }}
          style={{ cursor: !addingMode ? "pointer" : "crosshair" }} // Area is pointer if not adding
        >
          <rect
            x={area.x * cellSize}
            y={area.y * cellSize}
            width={area.width * cellSize}
            height={area.height * cellSize}
            fill={area.color}
            stroke={selectedAreaId === area.id ? "blue" : "dimgray"}
            strokeWidth={selectedAreaId === area.id ? 2 : 1}
          />
          <text
            x={area.x * cellSize + (area.width * cellSize) / 2}
            y={area.y * cellSize + (area.height * cellSize) / 2}
            fontSize="12px"
            fill="#333333"
            dominantBaseline="middle"
            textAnchor="middle"
            pointerEvents="none"
            style={{ fontWeight: 600 }}
          >
            {area.name}
          </text>
          {/* Components within the area */}
          {area.components.map(
            (comp) =>
              (
                <g
                  key={comp.id}
                  transform={`translate(${
                    (comp.x - 0.1) * cellSize
                  }, ${(comp.y + 0.1) * cellSize}) scale(${
                    cellSize / 800
                  })`}
                  pointerEvents="none"
                >
                  {IconOf(comp.type ?? 0)}
                </g>
              )
          )}
        </g>
      ))}

      {/* Preview Rectangle for new area */}
      {addingMode === "area_end" &&
        tempAreaStart &&
        tempAreaEndPreview && (
          <rect
            x={Math.min(tempAreaStart.x, tempAreaEndPreview.x) * cellSize}
            y={Math.min(tempAreaStart.y, tempAreaEndPreview.y) * cellSize}
            width={
              (Math.abs(tempAreaStart.x - tempAreaEndPreview.x) + 1) *
              cellSize
            }
            height={
              (Math.abs(tempAreaStart.y - tempAreaEndPreview.y) + 1) *
              cellSize
            }
            fill="rgba(25,118,210,0.2)"
            stroke="rgba(25,118,210,0.6)"
            strokeDasharray="3 3"
            pointerEvents="none"
          />
        )}
    </svg>
  );
});

FacilityCanvas.displayName = "FacilityCanvas";

export default FacilityCanvas;