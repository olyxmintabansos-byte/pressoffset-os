'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Crosshair,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Printer,
  Layers,
  Activity,
  FileCheck
} from 'lucide-react';
import { usePress } from '@/context/PressContext';
import { CMYKColor } from '@/types/press';

export default function PlatesDensitometerPage() {
  const {
    inkUnits,
    updateDensity,
    plates,
    nudgePlate,
    resetAlignment,
    densitometerHistory,
    recordDensitometerReading,
    currentJob
  } = usePress();

  const [inputCyan, setInputCyan] = useState<number>(1.45);
  const [inputMagenta, setInputMagenta] = useState<number>(1.50);
  const [inputYellow, setInputYellow] = useState<number>(1.05);
  const [inputBlack, setInputBlack] = useState<number>(1.75);
  const [dotGain, setDotGain] = useState<number>(15.5);
  const [recordedToast, setRecordedToast] = useState<string | null>(null);

  const handleRecordReading = (e: React.FormEvent) => {
    e.preventDefault();
    recordDensitometerReading({
      sheetNumber: currentJob.completedImpressions,
      cyanDensity: inputCyan,
      magentaDensity: inputMagenta,
      yellowDensity: inputYellow,
      blackDensity: inputBlack,
      dotGain50Pct: dotGain,
      withinTolerance: dotGain >= 13 && dotGain <= 17,
    });

    updateDensity('cyan', inputCyan);
    updateDensity('magenta', inputMagenta);
    updateDensity('yellow', inputYellow);
    updateDensity('black', inputBlack);

    setRecordedToast(`RECORDED SHEET #${currentJob.completedImpressions.toLocaleString()} TO LOG`);
    setTimeout(() => setRecordedToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#171514] text-[#e6dfd5] pb-20 halftone-screen">
      {/* Header */}
      <div className="bg-[#1f1c19] border-b border-[#3d3732] px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00a8e8] uppercase tracking-widest mb-1">
              <Crosshair className="w-4 h-4 text-[#00a8e8]" />
              <span>PRE-PRESS CTP & SPECTROPHOTOMETER LAB</span>
            </div>
            <h1 className="text-3xl font-mono font-extrabold tracking-tight text-white flex items-center gap-3">
              CTP & <span className="text-[#ffd000]">DENSITOMETER</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#2b2520] border border-[#786445] text-[#ffd000] font-mono font-normal">
                X-RITE EXACT SPECTRO CALIBRATED
              </span>
            </h1>
            <p className="text-sm font-mono text-[#a89f91] mt-1">
              Computer-to-Plate laser imaging registration, 50% halftone dot gain measurement, and reflection densitometry logs.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <Link
              href="/"
              className="px-4 py-2 bg-[#2b2520] hover:bg-[#38312b] text-[#e6dfd5] border border-[#786445] font-bold uppercase rounded flex items-center gap-2 cursor-pointer"
            >
              <span>← RETURN TO PRESSROOM</span>
            </Link>
          </div>
        </div>
      </div>

      {recordedToast && (
        <div className="bg-[#1b2b1a] border-b border-emerald-500 text-emerald-300 font-mono text-xs py-2 px-4 text-center sticky top-16 z-40 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{recordedToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Optical Reflection Densitometer Input & Active Tolerance Form */}
        <div className="kraft-card rounded-lg p-6">
          <div className="border-b border-[#3d3732] pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#e6dfd5] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#ffd000]" />
                <span>COLOR CONTROL STRIP DENSITOMETER SAMPLE</span>
              </h2>
              <p className="text-xs text-[#a89f91] mt-0.5">
                Measure optical solid ink reflection density and midtone 50% dot gain from the press sheet gripper edge.
              </p>
            </div>
            <span className="text-xs text-[#c29d59] font-mono bg-[#141211] px-3 py-1 rounded border border-[#3d3732]">
              TOLERANCE: ±0.05 D • DOT GAIN: 14% - 17%
            </span>
          </div>

          <form onSubmit={handleRecordReading} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-3 bg-[#141211] rounded border border-[#2e2a26]">
                <label className="text-xs font-bold text-[#00a8e8] block mb-1">CYAN SOLID DENSITY</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.8"
                  max="2.2"
                  value={inputCyan}
                  onChange={(e) => setInputCyan(parseFloat(e.target.value))}
                  className="w-full bg-[#1e1b18] border border-[#3d3732] rounded px-3 py-2 text-white font-bold"
                />
                <span className="text-[10px] text-[#8a7f70] block mt-1">Target: 1.45 D</span>
              </div>

              <div className="p-3 bg-[#141211] rounded border border-[#2e2a26]">
                <label className="text-xs font-bold text-[#e60067] block mb-1">MAGENTA SOLID DENSITY</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.8"
                  max="2.2"
                  value={inputMagenta}
                  onChange={(e) => setInputMagenta(parseFloat(e.target.value))}
                  className="w-full bg-[#1e1b18] border border-[#3d3732] rounded px-3 py-2 text-white font-bold"
                />
                <span className="text-[10px] text-[#8a7f70] block mt-1">Target: 1.50 D</span>
              </div>

              <div className="p-3 bg-[#141211] rounded border border-[#2e2a26]">
                <label className="text-xs font-bold text-[#ffd000] block mb-1">YELLOW SOLID DENSITY</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.6"
                  max="2.0"
                  value={inputYellow}
                  onChange={(e) => setInputYellow(parseFloat(e.target.value))}
                  className="w-full bg-[#1e1b18] border border-[#3d3732] rounded px-3 py-2 text-white font-bold"
                />
                <span className="text-[10px] text-[#8a7f70] block mt-1">Target: 1.05 D</span>
              </div>

              <div className="p-3 bg-[#141211] rounded border border-[#2e2a26]">
                <label className="text-xs font-bold text-[#e6dfd5] block mb-1">BLACK SOLID DENSITY</label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="2.4"
                  value={inputBlack}
                  onChange={(e) => setInputBlack(parseFloat(e.target.value))}
                  className="w-full bg-[#1e1b18] border border-[#3d3732] rounded px-3 py-2 text-white font-bold"
                />
                <span className="text-[10px] text-[#8a7f70] block mt-1">Target: 1.75 D</span>
              </div>

              <div className="p-3 bg-[#141211] rounded border border-[#2e2a26]">
                <label className="text-xs font-bold text-[#c29d59] block mb-1">50% DOT GAIN (TVI)</label>
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="25"
                  value={dotGain}
                  onChange={(e) => setDotGain(parseFloat(e.target.value))}
                  className="w-full bg-[#1e1b18] border border-[#3d3732] rounded px-3 py-2 text-white font-bold"
                />
                <span className="text-[10px] text-[#8a7f70] block mt-1">ISO Standard: 15.0%</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#ffd000] hover:bg-[#e6bb00] text-black font-bold uppercase rounded shadow-md cursor-pointer flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>COMMIT SPECTRO READING TO LOG</span>
              </button>
            </div>
          </form>
        </div>

        {/* Densitometer History Table */}
        <div className="kraft-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4 border-b border-[#3d3732] pb-3">
            <h3 className="text-sm font-bold text-[#e6dfd5] uppercase tracking-wider">
              SPECTROPHOTOMETER LOGGED SAMPLES (ISO 12647 AUDIT TRAIL)
            </h3>
            <span className="text-xs text-[#8a7f70]">{densitometerHistory.length} ENTRIES LOGGED</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-[#141211] text-[#8a7f70] border-b border-[#3d3732]">
                <tr>
                  <th className="py-2.5 px-3">TIMESTAMP</th>
                  <th className="py-2.5 px-3">SHEET #</th>
                  <th className="py-2.5 px-3 text-[#00a8e8]">CYAN (1.45D)</th>
                  <th className="py-2.5 px-3 text-[#e60067]">MAGENTA (1.50D)</th>
                  <th className="py-2.5 px-3 text-[#ffd000]">YELLOW (1.05D)</th>
                  <th className="py-2.5 px-3 text-white">BLACK (1.75D)</th>
                  <th className="py-2.5 px-3 text-[#c29d59]">50% DOT GAIN</th>
                  <th className="py-2.5 px-3">AUDIT STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2a26]">
                {densitometerHistory.map((reading) => (
                  <tr key={reading.id} className="hover:bg-[#1a1715]">
                    <td className="py-2.5 px-3 text-[#a89f91]">{reading.timestamp}</td>
                    <td className="py-2.5 px-3 font-bold text-[#e6dfd5]">#{reading.sheetNumber.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-[#00a8e8] font-bold">{reading.cyanDensity.toFixed(2)} D</td>
                    <td className="py-2.5 px-3 text-[#e60067] font-bold">{reading.magentaDensity.toFixed(2)} D</td>
                    <td className="py-2.5 px-3 text-[#ffd000] font-bold">{reading.yellowDensity.toFixed(2)} D</td>
                    <td className="py-2.5 px-3 text-white font-bold">{reading.blackDensity.toFixed(2)} D</td>
                    <td className="py-2.5 px-3 text-[#c29d59] font-bold">+{reading.dotGain50Pct.toFixed(1)}%</td>
                    <td className="py-2.5 px-3">
                      {reading.withinTolerance ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                          ✓ IN SPEC
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-400 text-[10px] font-bold">
                          ⚠ OUT OF SPEC
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}