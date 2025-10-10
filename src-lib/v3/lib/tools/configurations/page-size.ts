type Unit = "mm" | "px" | "in";

interface PageSize {
  width: number;
  height: number;
}

const MM_TO_PX = 3.779527;
const MM_TO_IN = 0.0393701;

const pageSizesMM: Record<string, PageSize> = {
  // A-series
  A0: { width: 841, height: 1189 },
  A1: { width: 594, height: 841 },
  A2: { width: 420, height: 594 },
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  A6: { width: 105, height: 148 },

  // B-series
  B0: { width: 1000, height: 1414 },
  B1: { width: 707, height: 1000 },
  B2: { width: 500, height: 707 },
  B3: { width: 353, height: 500 },
  B4: { width: 250, height: 353 },
  B5: { width: 176, height: 250 },

  // C-series
  C4: { width: 229, height: 324 },
  C5: { width: 162, height: 229 },
  C6: { width: 114, height: 162 },
};

/**
 * Converts a page size from mm to the specified unit.
 * @param sizeName - The ISO page size name (e.g., 'A4', 'B2')
 * @param unit - Desired unit: 'mm', 'px', or 'in'
 * @returns PageSize object with width and height in the specified unit
 */
export function getPageSize(sizeName: string, unit: Unit = "mm"): PageSize | null {
  const size = pageSizesMM[sizeName.toUpperCase()];
  if (!size) return null;

  switch (unit) {
    case "px":
      return {
        width: Math.round(size.width * MM_TO_PX),
        height: Math.round(size.height * MM_TO_PX),
      };
    case "in":
      return {
        width: parseFloat((size.width * MM_TO_IN).toFixed(2)),
        height: parseFloat((size.height * MM_TO_IN).toFixed(2)),
      };
    case "mm":
    default:
      return size;
  }
}
