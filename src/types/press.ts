export type CMYKColor = 'cyan' | 'magenta' | 'yellow' | 'black';

export interface InkUnit {
  color: CMYKColor;
  label: string;
  hex: string;
  fountainLevel: number; // 0 to 100%
  targetDensity: number; // 0.8 to 2.2 D
  currentDensity: number; // Optical reflection density
  rollerTemp: number; // Celsius (22 - 34°C)
  waterBalance: number; // Dampening solution 0 to 100%
}

export interface PlateRegistration {
  color: CMYKColor;
  offsetX: number; // mm (-1.5 to +1.5mm)
  offsetY: number; // mm (-1.5 to +1.5mm)
  skew: number; // milliradians (-0.05 to +0.05)
  isAligned: boolean;
}

export interface PrintJob {
  id: string;
  jobCode: string;
  title: string;
  client: string;
  totalImpressions: number;
  completedImpressions: number;
  runSpeedSPH: number; // Sheets Per Hour (e.g. 12000 SPH)
  paperStock: string;
  grammageGSM: number;
  sheetSize: string; // e.g. 720 x 1020 mm (B1)
  status: 'SETUP' | 'PRINTING' | 'PAUSED' | 'COMPLETED';
  startedAt: string;
}

export interface DensitometerReading {
  id: string;
  timestamp: string;
  sheetNumber: number;
  cyanDensity: number;
  magentaDensity: number;
  yellowDensity: number;
  blackDensity: number;
  dotGain50Pct: number; // Target ~14-18%
  withinTolerance: boolean;
}

export interface PressContextType {
  inkUnits: Record<CMYKColor, InkUnit>;
  updateInkLevel: (color: CMYKColor, level: number) => void;
  updateDensity: (color: CMYKColor, density: number) => void;
  plates: Record<CMYKColor, PlateRegistration>;
  nudgePlate: (color: CMYKColor, axis: 'X' | 'Y', delta: number) => void;
  resetAlignment: () => void;
  currentJob: PrintJob;
  updateJobStatus: (status: PrintJob['status']) => void;
  incrementSheets: (count: number) => void;
  densitometerHistory: DensitometerReading[];
  recordDensitometerReading: (reading: Omit<DensitometerReading, 'id' | 'timestamp'>) => void;
  isPressRunning: boolean;
  togglePressRun: () => void;
}