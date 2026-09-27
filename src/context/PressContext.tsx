'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  CMYKColor,
  InkUnit,
  PlateRegistration,
  PrintJob,
  DensitometerReading,
  PressContextType
} from '@/types/press';

const INITIAL_INKS: Record<CMYKColor, InkUnit> = {
  cyan: {
    color: 'cyan',
    label: 'PROCESS CYAN (C)',
    hex: '#00a8e8',
    fountainLevel: 78,
    targetDensity: 1.45,
    currentDensity: 1.44,
    rollerTemp: 26.4,
    waterBalance: 42,
  },
  magenta: {
    color: 'magenta',
    label: 'PROCESS MAGENTA (M)',
    hex: '#e60067',
    fountainLevel: 64,
    targetDensity: 1.50,
    currentDensity: 1.51,
    rollerTemp: 27.1,
    waterBalance: 44,
  },
  yellow: {
    color: 'yellow',
    label: 'PROCESS YELLOW (Y)',
    hex: '#ffd000',
    fountainLevel: 82,
    targetDensity: 1.05,
    currentDensity: 1.03,
    rollerTemp: 25.8,
    waterBalance: 39,
  },
  black: {
    color: 'black',
    label: 'PROCESS BLACK (K)',
    hex: '#1e1b18',
    fountainLevel: 71,
    targetDensity: 1.75,
    currentDensity: 1.76,
    rollerTemp: 26.9,
    waterBalance: 45,
  },
};

const INITIAL_PLATES: Record<CMYKColor, PlateRegistration> = {
  cyan: { color: 'cyan', offsetX: 0.0, offsetY: 0.0, skew: 0.0, isAligned: true },
  magenta: { color: 'magenta', offsetX: 0.08, offsetY: -0.05, skew: 0.01, isAligned: false },
  yellow: { color: 'yellow', offsetX: -0.04, offsetY: 0.02, skew: 0.0, isAligned: true },
  black: { color: 'black', offsetX: 0.0, offsetY: 0.0, skew: 0.0, isAligned: true },
};

const INITIAL_JOB: PrintJob = {
  id: 'job-vintage-88',
  jobCode: 'HD-2026-B1-409',
  title: 'VINTAGE BOTANICAL COFFEE TABLE MONOGRAPH',
  client: 'Atelier Gutenberg Fine Press Inc.',
  totalImpressions: 25000,
  completedImpressions: 14820,
  runSpeedSPH: 13500,
  paperStock: 'Munken Pure Rough Warm White',
  grammageGSM: 170,
  sheetSize: '720 x 1020 mm (B1)',
  status: 'PRINTING',
  startedAt: '06:30 AM',
};

const INITIAL_READINGS: DensitometerReading[] = [
  {
    id: 'd-1',
    timestamp: '08:45:10',
    sheetNumber: 14500,
    cyanDensity: 1.44,
    magentaDensity: 1.51,
    yellowDensity: 1.03,
    blackDensity: 1.76,
    dotGain50Pct: 15.2,
    withinTolerance: true,
  },
  {
    id: 'd-2',
    timestamp: '08:30:00',
    sheetNumber: 11000,
    cyanDensity: 1.43,
    magentaDensity: 1.49,
    yellowDensity: 1.02,
    blackDensity: 1.74,
    dotGain50Pct: 14.8,
    withinTolerance: true,
  },
  {
    id: 'd-3',
    timestamp: '08:15:20',
    sheetNumber: 7600,
    cyanDensity: 1.46,
    magentaDensity: 1.53,
    yellowDensity: 1.06,
    blackDensity: 1.77,
    dotGain50Pct: 16.1,
    withinTolerance: true,
  },
];

const LOCAL_STORAGE_KEY = 'pressoffset_os_state_v1';

const PressContext = createContext<PressContextType | undefined>(undefined);

export function PressProvider({ children }: { children: React.ReactNode }) {
  const [inkUnits, setInkUnits] = useState<Record<CMYKColor, InkUnit>>(INITIAL_INKS);
  const [plates, setPlates] = useState<Record<CMYKColor, PlateRegistration>>(INITIAL_PLATES);
  const [currentJob, setCurrentJob] = useState<PrintJob>(INITIAL_JOB);
  const [densitometerHistory, setDensitometerHistory] = useState<DensitometerReading[]>(INITIAL_READINGS);
  const [isPressRunning, setIsPressRunning] = useState<boolean>(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.inkUnits) setInkUnits(parsed.inkUnits);
        if (parsed.plates) setPlates(parsed.plates);
        if (parsed.currentJob) setCurrentJob(parsed.currentJob);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ inkUnits, plates, currentJob })
      );
    } catch {}
  }, [inkUnits, plates, currentJob]);

  useEffect(() => {
    if (!isPressRunning) return;
    const interval = setInterval(() => {
      setCurrentJob((prev) => {
        if (prev.completedImpressions >= prev.totalImpressions) {
          setIsPressRunning(false);
          return { ...prev, status: 'COMPLETED' };
        }
        return {
          ...prev,
          completedImpressions: Math.min(prev.totalImpressions, prev.completedImpressions + 25),
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPressRunning]);

  const updateInkLevel = (color: CMYKColor, level: number) => {
    setInkUnits((prev) => ({
      ...prev,
      [color]: { ...prev[color], fountainLevel: Math.max(0, Math.min(100, level)) },
    }));
  };

  const updateDensity = (color: CMYKColor, density: number) => {
    setInkUnits((prev) => ({
      ...prev,
      [color]: { ...prev[color], currentDensity: parseFloat(density.toFixed(2)) },
    }));
  };

  const nudgePlate = (color: CMYKColor, axis: 'X' | 'Y', delta: number) => {
    setPlates((prev) => {
      const current = prev[color];
      const newX = axis === 'X' ? parseFloat((current.offsetX + delta).toFixed(3)) : current.offsetX;
      const newY = axis === 'Y' ? parseFloat((current.offsetY + delta).toFixed(3)) : current.offsetY;
      const aligned = Math.abs(newX) <= 0.02 && Math.abs(newY) <= 0.02;
      return {
        ...prev,
        [color]: { ...current, offsetX: newX, offsetY: newY, isAligned: aligned },
      };
    });
  };

  const resetAlignment = () => {
    setPlates({
      cyan: { color: 'cyan', offsetX: 0, offsetY: 0, skew: 0, isAligned: true },
      magenta: { color: 'magenta', offsetX: 0, offsetY: 0, skew: 0, isAligned: true },
      yellow: { color: 'yellow', offsetX: 0, offsetY: 0, skew: 0, isAligned: true },
      black: { color: 'black', offsetX: 0, offsetY: 0, skew: 0, isAligned: true },
    });
  };

  const updateJobStatus = (status: PrintJob['status']) => {
    setCurrentJob((prev) => ({ ...prev, status }));
    if (status === 'PAUSED' || status === 'COMPLETED') {
      setIsPressRunning(false);
    } else if (status === 'PRINTING') {
      setIsPressRunning(true);
    }
  };

  const incrementSheets = (count: number) => {
    setCurrentJob((prev) => ({
      ...prev,
      completedImpressions: Math.min(prev.totalImpressions, prev.completedImpressions + count),
    }));
  };

  const recordDensitometerReading = (reading: Omit<DensitometerReading, 'id' | 'timestamp'>) => {
    const newEntry: DensitometerReading = {
      ...reading,
      id: `d-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setDensitometerHistory((prev) => [newEntry, ...prev.slice(0, 19)]);
  };

  const togglePressRun = () => {
    setIsPressRunning((prev) => {
      const next = !prev;
      setCurrentJob((j) => ({ ...j, status: next ? 'PRINTING' : 'PAUSED' }));
      return next;
    });
  };

  return (
    <PressContext.Provider
      value={{
        inkUnits,
        updateInkLevel,
        updateDensity,
        plates,
        nudgePlate,
        resetAlignment,
        currentJob,
        updateJobStatus,
        incrementSheets,
        densitometerHistory,
        recordDensitometerReading,
        isPressRunning,
        togglePressRun,
      }}
    >
      {children}
    </PressContext.Provider>
  );
}

export function usePress() {
  const context = useContext(PressContext);
  if (!context) throw new Error('usePress must be used within a PressProvider');
  return context;
}