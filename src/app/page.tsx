'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  Gauge,
  Sliders,
  Crosshair,
  Layers,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { usePress } from '@/context/PressContext';
import { CMYKColor } from '@/types/press';

export default function PressCockpitPage() {
  const {
    inkUnits,
    updateInkLevel,
    updateDensity,
    plates,
    nudgePlate,
    resetAlignment,
    currentJob,
    isPressRunning,
    togglePressRun
  } = usePress();

  const [activeFountainTab, setActiveFountainTab] = useState<CMYKColor>('cyan');

  const cmykOrder: CMYKColor[] = ['cyan', 'magenta', 'yellow', 'black'];

  return (
    <div className="min-h-screen bg-[#171514] text-[#e6dfd5] pb-20 halftone-screen">
      {/* Banner */}
      <div className="bg-[#1f1c19] border-b border-[#3d3732] px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#c29d59] uppercase tracking-widest mb-1">
              <Cpu className="w-4 h-4 text-[#c29d59]" />
              <span>MAIN PRINTING UNIT (MPU-8) • SHEET-FED OFFSET</span>
            </div>
            <h1 className="text-3xl font-mono font-extrabold tracking-tight text-white flex items-center gap-3">
              PRESSROOM <span className="text-[#00a8e8]">COCKPIT</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#2b2520] border border-[#786445] text-[#ffd000] font-mono font-normal">
                {currentJob.status} • {isPressRunning ? 'FEEDER ENGAGED' : 'FEEDER IDLE'}
              </span>
            </h1>
            <p className="text-sm font-mono text-[#a89f91] mt-1">
              Active run monitoring, 4-color ink fountain duct sweeps, roller temperatures, and micrometer plate registration.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <Link
              href="/plates/"
              className="px-4 py-2 bg-[#2b2520] hover:bg-[#38312b] text-[#ffd000] border border-[#786445] font-bold uppercase rounded flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Crosshair className="w-4 h-4 text-[#00a8e8]" />
              <span>CTP ALIGNMENT & DENSITOMETER →</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Job Telemetry Card */}
        <div className="kraft-card rounded-lg p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3d3732] pb-4 mb-4">
            <div>
              <span className="text-[10px] text-[#8a7f70] uppercase tracking-widest block">ACTIVE RUN SPECIFICATION</span>
              <h2 className="text-xl font-bold text-[#e6dfd5]">{currentJob.title}</h2>
              <span className="text-xs text-[#a89f91]">Client: {currentJob.client} • Stock: {currentJob.paperStock} ({currentJob.grammageGSM} GSM, {currentJob.sheetSize})</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-[#8a7f70] block">COMPLETION</span>
                <span className="text-xl font-bold text-[#ffd000]">
                  {Math.round((currentJob.completedImpressions / currentJob.totalImpressions) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-[#141211] h-3 rounded-full overflow-hidden border border-[#3d3732]">
              <div
                className="bg-gradient-to-r from-[#00a8e8] via-[#e60067] to-[#ffd000] h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (currentJob.completedImpressions / currentJob.totalImpressions) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#8a7f70]">
              <span>START: {currentJob.startedAt}</span>
              <span>{currentJob.completedImpressions.toLocaleString()} OF {currentJob.totalImpressions.toLocaleString()} IMPRESSIONS</span>
              <span>EST. REMAINING: {Math.max(0, Math.round((currentJob.totalImpressions - currentJob.completedImpressions) / (currentJob.runSpeedSPH / 60)))} MIN</span>
            </div>
          </div>
        </div>

        {/* 4 CMYK Inking Units Cockpit */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cmykOrder.map((color) => {
            const ink = inkUnits[color];
            const plate = plates[color];

            return (
              <div
                key={color}
                className="kraft-card rounded-lg p-5 flex flex-col justify-between border-t-4"
                style={{ borderTopColor: ink.hex }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-wider" style={{ color: color === 'yellow' ? '#ffd000' : ink.hex }}>
                      {ink.label}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        plate.isAligned ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {plate.isAligned ? 'ALIGNED' : 'MISREGISTER'}
                    </span>
                  </div>

                  {/* Fountain Level Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs text-[#a89f91]">
                      <span>INK FOUNTAIN DUCT</span>
                      <span className="font-bold text-[#e6dfd5]">{ink.fountainLevel}%</span>
                    </div>
                    <div className="w-full bg-[#121110] h-2.5 rounded-full overflow-hidden border border-[#3d3732]">
                      <div
                        className="h-full transition-all"
                        style={{ width: `${ink.fountainLevel}%`, backgroundColor: ink.hex }}
                      />
                    </div>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#8a7f70] bg-[#171514] p-2.5 rounded border border-[#2e2a26] mb-4">
                    <div>
                      <span>DENSITY:</span>
                      <strong className="block text-[#e6dfd5]">{ink.currentDensity.toFixed(2)} D</strong>
                      <span className="text-[10px] text-[#635b51]">TARGET: {ink.targetDensity} D</span>
                    </div>
                    <div>
                      <span>ROLLER TEMP:</span>
                      <strong className="block text-[#e6dfd5]">{ink.rollerTemp}°C</strong>
                      <span className="text-[10px] text-[#635b51]">WATER: {ink.waterBalance}%</span>
                    </div>
                  </div>

                  {/* Micro-Adjustment Registration */}
                  <div className="space-y-2 border-t border-[#2e2a26] pt-3">
                    <div className="flex justify-between text-[11px] text-[#a89f91]">
                      <span>X OFFSET: <strong className="text-[#e6dfd5]">{plate.offsetX > 0 ? `+${plate.offsetX}` : plate.offsetX} mm</strong></span>
                      <span>Y OFFSET: <strong className="text-[#e6dfd5]">{plate.offsetY > 0 ? `+${plate.offsetY}` : plate.offsetY} mm</strong></span>
                    </div>

                    <div className="grid grid-cols-4 gap-1">
                      <button
                        onClick={() => nudgePlate(color, 'X', -0.02)}
                        className="py-1 bg-[#1a1716] hover:bg-[#2e2925] border border-[#3d3732] rounded text-[10px] font-bold text-[#e6dfd5] cursor-pointer"
                      >
                        -X
                      </button>
                      <button
                        onClick={() => nudgePlate(color, 'X', 0.02)}
                        className="py-1 bg-[#1a1716] hover:bg-[#2e2925] border border-[#3d3732] rounded text-[10px] font-bold text-[#e6dfd5] cursor-pointer"
                      >
                        +X
                      </button>
                      <button
                        onClick={() => nudgePlate(color, 'Y', -0.02)}
                        className="py-1 bg-[#1a1716] hover:bg-[#2e2925] border border-[#3d3732] rounded text-[10px] font-bold text-[#e6dfd5] cursor-pointer"
                      >
                        -Y
                      </button>
                      <button
                        onClick={() => nudgePlate(color, 'Y', 0.02)}
                        className="py-1 bg-[#1a1716] hover:bg-[#2e2925] border border-[#3d3732] rounded text-[10px] font-bold text-[#e6dfd5] cursor-pointer"
                      >
                        +Y
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#3d3732] flex items-center justify-between">
                  <span className="text-[10px] text-[#8a7f70]">INK REFILL:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateInkLevel(color, ink.fountainLevel - 10)}
                      className="px-2 py-0.5 bg-[#1b1917] hover:bg-[#292522] border border-[#3d3732] rounded text-xs text-[#a89f91] cursor-pointer"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => updateInkLevel(color, ink.fountainLevel + 10)}
                      className="px-2 py-0.5 bg-[#1b1917] hover:bg-[#292522] border border-[#3d3732] rounded text-xs text-[#a89f91] cursor-pointer"
                    >
                      +10%
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-Time Halftone Rosette Pattern Scope & Registration Crosshair */}
        <div className="kraft-card rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3d3732] pb-4 mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#c29d59] font-bold flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-[#ffd000]" /> OPTICAL MICROSCOPE REGISTRATION REGISTER (50X ZOOM)
              </span>
              <p className="text-xs text-[#a89f91] mt-1">
                Simulated 4-color halftone dot rosette screen showing plate overlay tolerances at 175 LPI (Lines Per Inch).
              </p>
            </div>
            <button
              onClick={resetAlignment}
              className="px-3.5 py-1.5 bg-[#2b2520] hover:bg-[#38312b] border border-[#786445] text-[#ffd000] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>CALIBRATE PERFECT ZERO</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Crosshair Loupe Visualizer */}
            <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-[#0e0d0c] rounded border border-[#3d3732] relative overflow-hidden">
              <div className="w-44 h-44 rounded-full border-2 border-[#786445] relative flex items-center justify-center bg-[#171514] shadow-inner">
                {/* Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[1px] bg-[#e6dfd5]/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-full w-[1px] bg-[#e6dfd5]/20" />
                </div>
                <div className="w-24 h-24 rounded-full border border-dashed border-[#e6dfd5]/30 pointer-events-none" />

                {/* CMYK Target Rings with individual offsets */}
                <div
                  className="absolute w-16 h-16 rounded-full border-2 border-[#00a8e8] transition-all"
                  style={{
                    transform: `translate(${plates.cyan.offsetX * 40}px, ${plates.cyan.offsetY * 40}px)`,
                  }}
                />
                <div
                  className="absolute w-16 h-16 rounded-full border-2 border-[#e60067] transition-all"
                  style={{
                    transform: `translate(${plates.magenta.offsetX * 40}px, ${plates.magenta.offsetY * 40}px)`,
                  }}
                />
                <div
                  className="absolute w-16 h-16 rounded-full border-2 border-[#ffd000] transition-all"
                  style={{
                    transform: `translate(${plates.yellow.offsetX * 40}px, ${plates.yellow.offsetY * 40}px)`,
                  }}
                />
                <div
                  className="absolute w-16 h-16 rounded-full border-2 border-[#e6dfd5] transition-all"
                  style={{
                    transform: `translate(${plates.black.offsetX * 40}px, ${plates.black.offsetY * 40}px)`,
                  }}
                />
              </div>

              <div className="text-[11px] text-[#8a7f70] mt-3 text-center">
                <span>MAGENTA MISREGISTER: </span>
                <strong className="text-[#e60067]">{plates.magenta.offsetX}mm X, {plates.magenta.offsetY}mm Y</strong>
              </div>
            </div>

            {/* Rosette Angle Specs */}
            <div className="md:col-span-2 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#141211] rounded border border-[#2e2a26]">
                  <span className="text-[#00a8e8] font-bold block">CYAN (C)</span>
                  <span className="text-[#e6dfd5] text-sm font-bold">15.0° ANGLE</span>
                  <span className="text-[10px] text-[#8a7f70] block mt-1">Screen: 175 LPI</span>
                </div>
                <div className="p-3 bg-[#141211] rounded border border-[#2e2a26]">
                  <span className="text-[#e60067] font-bold block">MAGENTA (M)</span>
                  <span className="text-[#e6dfd5] text-sm font-bold">75.0° ANGLE</span>
                  <span className="text-[10px] text-[#8a7f70] block mt-1">Screen: 175 LPI</span>
                </div>
                <div className="p-3 bg-[#141211] rounded border border-[#2e2a26]">
                  <span className="text-[#ffd000] font-bold block">YELLOW (Y)</span>
                  <span className="text-[#e6dfd5] text-sm font-bold">0.0° ANGLE</span>
                  <span className="text-[10px] text-[#8a7f70] block mt-1">Screen: 175 LPI</span>
                </div>
                <div className="p-3 bg-[#141211] rounded border border-[#2e2a26]">
                  <span className="text-[#e6dfd5] font-bold block">BLACK (K)</span>
                  <span className="text-[#e6dfd5] text-sm font-bold">45.0° ANGLE</span>
                  <span className="text-[10px] text-[#8a7f70] block mt-1">Screen: 175 LPI</span>
                </div>
              </div>

              <div className="p-4 bg-[#141211] rounded border border-[#2e2a26] text-xs text-[#a89f91] space-y-2">
                <div className="font-bold text-[#e6dfd5] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ISO 12647-2 PRINT STANDARD CERTIFICATION</span>
                </div>
                <p className="leading-relaxed">
                  Screen angles are calibrated to avoid optical Moiré interference patterns. Pressroom environmental control is maintaining 22°C ambient and 54% relative humidity to ensure paper dimensional stability across all 8 printing towers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}