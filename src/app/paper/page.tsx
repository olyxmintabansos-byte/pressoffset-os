'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Layers,
  Compass,
  Calculator,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Coins,
  Download,
  RefreshCw,
  Sliders,
  Scale
} from 'lucide-react';
import { usePress } from '@/context/PressContext';

interface ParentSheetPreset {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
}

const PARENT_SHEETS: ParentSheetPreset[] = [
  { id: 'b1', name: 'ISO B1 (Heidelberg Speedmaster XL 106)', widthMm: 720, heightMm: 1020 },
  { id: 'b2', name: 'ISO B2 (Half-Size Format)', widthMm: 520, heightMm: 720 },
  { id: 'a1', name: 'ISO A1 (Standard European)', widthMm: 594, heightMm: 841 },
  { id: 'a0', name: 'ISO A0 (Full Industrial)', widthMm: 841, heightMm: 1189 },
];

const FINISHED_SIZES = [
  { id: 'a4', name: 'A4 Document / Magazine', width: 210, height: 297 },
  { id: 'a5', name: 'A5 Monograph / Booklet', width: 148, height: 210 },
  { id: 'b5', name: 'B5 Art Catalog', width: 176, height: 250 },
  { id: 'square', name: 'Square Art Monograph', width: 210, height: 210 },
];

export default function PaperCalculatorPage() {
  const { currentJob } = usePress();

  const [selectedParent, setSelectedParent] = useState<ParentSheetPreset>(PARENT_SHEETS[0]);
  const [finishedWidth, setFinishedWidth] = useState<number>(210);
  const [finishedHeight, setFinishedHeight] = useState<number>(297);
  const [bleedMm, setBleedMm] = useState<number>(3);
  const [gripperMarginMm, setGripperMarginMm] = useState<number>(15);
  const [paperGsm, setPaperGsm] = useState<number>(170);
  const [pricePerKg, setPricePerKg] = useState<number>(1.85);
  const [makereadyWastePct, setMakereadyWastePct] = useState<number>(4.5);
  const [grainDirection, setGrainDirection] = useState<'LONG' | 'SHORT'>('LONG');

  const totalItemW = finishedWidth + bleedMm * 2;
  const totalItemH = finishedHeight + bleedMm * 2;
  const usableParentW = selectedParent.widthMm - gripperMarginMm * 2;
  const usableParentH = selectedParent.heightMm - gripperMarginMm * 2;

  const cols1 = Math.max(1, Math.floor(usableParentW / totalItemW));
  const rows1 = Math.max(1, Math.floor(usableParentH / totalItemH));
  const yield1 = cols1 * rows1;

  const cols2 = Math.max(1, Math.floor(usableParentW / totalItemH));
  const rows2 = Math.max(1, Math.floor(usableParentH / totalItemW));
  const yield2 = cols2 * rows2;

  const optimalYield = Math.max(yield1, yield2);
  const isRotatedOptimal = yield2 > yield1;
  const finalCols = isRotatedOptimal ? cols2 : cols1;
  const finalRows = isRotatedOptimal ? rows2 : rows1;

  const parentAreaM2 = (selectedParent.widthMm * selectedParent.heightMm) / 1000000;
  const totalItemsAreaM2 = (finishedWidth * finishedHeight * optimalYield) / 1000000;
  const sheetEfficiencyPct = Math.min(100, Math.round((totalItemsAreaM2 / parentAreaM2) * 100));

  const impressionsRequired = currentJob.totalImpressions;
  const grossSheets = Math.ceil(impressionsRequired * (1 + makereadyWastePct / 100));
  const reamsRequired = (grossSheets / 500).toFixed(1);
  const weightPer1000SheetsKg = parentAreaM2 * paperGsm;
  const totalTonnageKg = Math.round((grossSheets * weightPer1000SheetsKg) / 1000);
  const totalTonnageTons = (totalTonnageKg / 1000).toFixed(2);
  const totalEstimatedCostUSD = Math.round(totalTonnageKg * pricePerKg);

  return (
    <div className="min-h-screen bg-[#171514] text-[#e6dfd5] pb-20 halftone-screen">
      {/* Banner */}
      <div className="bg-[#1f1c19] border-b border-[#3d3732] px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ffd000] uppercase tracking-widest mb-1">
              <FileSpreadsheet className="w-4 h-4 text-[#ffd000]" />
              <span>ESTIMATING & SUBSTRATE ENGINEERING LAB</span>
            </div>
            <h1 className="text-3xl font-mono font-extrabold tracking-tight text-white flex items-center gap-3">
              PAPER STOCK & <span className="text-[#00a8e8]">GRAIN CALCULATOR</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#2b2520] border border-[#786445] text-[#ffd000] font-mono font-normal">
                ISO 216 / DIN 476 COMPLIANT
              </span>
            </h1>
            <p className="text-sm font-mono text-[#a89f91] mt-1">
              Imposition nesting yield, grain direction crack physics, gross tonnage requirement, and makeready waste optimization.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <Link
              href="/bindery/"
              className="px-4 py-2 bg-[#ffd000] hover:bg-[#e6bb00] text-black font-bold uppercase rounded flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>BINDERY & FINISHING →</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Quick Tonnage & Economy KPI Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="kraft-card rounded-lg p-4">
            <span className="text-[10px] text-[#8a7f70] block">SHEET YIELD</span>
            <strong className="text-2xl text-[#ffd000] font-extrabold block mt-1">
              {optimalYield}-UP
            </strong>
            <span className="text-xs text-[#a89f91]">
              {sheetEfficiencyPct}% Surface Efficiency
            </span>
          </div>

          <div className="kraft-card rounded-lg p-4">
            <span className="text-[10px] text-[#8a7f70] block">GROSS PRESS SHEETS</span>
            <strong className="text-2xl text-white font-extrabold block mt-1">
              {grossSheets.toLocaleString()}
            </strong>
            <span className="text-xs text-[#a89f91]">
              {reamsRequired} Reams (+{makereadyWastePct}% Waste)
            </span>
          </div>

          <div className="kraft-card rounded-lg p-4">
            <span className="text-[10px] text-[#8a7f70] block">TOTAL NET TONNAGE</span>
            <strong className="text-2xl text-[#00a8e8] font-extrabold block mt-1">
              {totalTonnageTons} TONS
            </strong>
            <span className="text-xs text-[#a89f91]">
              {totalTonnageKg.toLocaleString()} kg ({paperGsm} GSM)
            </span>
          </div>

          <div className="kraft-card rounded-lg p-4">
            <span className="text-[10px] text-[#8a7f70] block">ESTIMATED STOCK COST</span>
            <strong className="text-2xl text-emerald-400 font-extrabold block mt-1">
              ${totalEstimatedCostUSD.toLocaleString()}
            </strong>
            <span className="text-xs text-[#a89f91]">
              @ ${pricePerKg}/kg Munken Fine Paper
            </span>
          </div>
        </div>

        {/* Input Parameters & Grain Physics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
          {/* Controls Column */}
          <div className="kraft-card rounded-lg p-5 space-y-5">
            <h2 className="text-sm font-bold text-[#e6dfd5] uppercase tracking-wider border-b border-[#3d3732] pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#ffd000]" />
              <span>SUBSTRATE & IMPOSITION SETUP</span>
            </h2>

            <div>
              <label className="text-xs text-[#a89f91] block mb-1">PARENT PRESS SHEET SIZE</label>
              <select
                value={selectedParent.id}
                onChange={(e) => {
                  const p = PARENT_SHEETS.find((x) => x.id === e.target.value);
                  if (p) setSelectedParent(p);
                }}
                className="w-full bg-[#141211] border border-[#3d3732] rounded p-2 text-xs text-[#e6dfd5] font-bold focus:border-[#ffd000] focus:outline-none"
              >
                {PARENT_SHEETS.map((sheet) => (
                  <option key={sheet.id} value={sheet.id}>
                    {sheet.name} ({sheet.widthMm} x {sheet.heightMm} mm)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#a89f91] block mb-1">FINISHED ITEM PRESET</label>
              <div className="grid grid-cols-2 gap-2">
                {FINISHED_SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                      setFinishedWidth(size.width);
                      setFinishedHeight(size.height);
                    }}
                    className={`py-1.5 px-2 text-[11px] rounded border transition-all text-left ${
                      finishedWidth === size.width && finishedHeight === size.height
                        ? 'bg-[#2b2520] border-[#ffd000] text-[#ffd000] font-bold'
                        : 'bg-[#141211] border-[#3d3732] text-[#8a7f70] hover:text-[#e6dfd5]'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#a89f91] block mb-1">WIDTH (mm)</label>
                <input
                  type="number"
                  value={finishedWidth}
                  onChange={(e) => setFinishedWidth(parseInt(e.target.value) || 10)}
                  className="w-full bg-[#141211] border border-[#3d3732] rounded p-2 text-xs text-[#e6dfd5] font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#a89f91] block mb-1">HEIGHT (mm)</label>
                <input
                  type="number"
                  value={finishedHeight}
                  onChange={(e) => setFinishedHeight(parseInt(e.target.value) || 10)}
                  className="w-full bg-[#141211] border border-[#3d3732] rounded p-2 text-xs text-[#e6dfd5] font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[#a89f91] block mb-1">GRAMMAGE (GSM)</label>
                <input
                  type="number"
                  value={paperGsm}
                  onChange={(e) => setPaperGsm(parseInt(e.target.value) || 50)}
                  className="w-full bg-[#141211] border border-[#3d3732] rounded p-2 text-xs text-[#e6dfd5] font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#a89f91] block mb-1">BLEED TRIM (mm)</label>
                <input
                  type="number"
                  value={bleedMm}
                  onChange={(e) => setBleedMm(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#141211] border border-[#3d3732] rounded p-2 text-xs text-[#e6dfd5] font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#a89f91] block mb-1">FIBER GRAIN ORIENTATION</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGrainDirection('LONG')}
                  className={`p-2 rounded border text-xs font-bold transition-all ${
                    grainDirection === 'LONG'
                      ? 'bg-[#2b2520] border-[#00a8e8] text-[#00a8e8]'
                      : 'bg-[#141211] border-[#3d3732] text-[#8a7f70]'
                  }`}
                >
                  GRAIN LONG (GL)
                  <span className="text-[9px] block font-normal opacity-80 mt-0.5">Parallel to {selectedParent.heightMm}mm</span>
                </button>
                <button
                  onClick={() => setGrainDirection('SHORT')}
                  className={`p-2 rounded border text-xs font-bold transition-all ${
                    grainDirection === 'SHORT'
                      ? 'bg-[#2b2520] border-[#e60067] text-[#e60067]'
                      : 'bg-[#141211] border-[#3d3732] text-[#8a7f70]'
                  }`}
                >
                  GRAIN SHORT (GS)
                  <span className="text-[9px] block font-normal opacity-80 mt-0.5">Parallel to {selectedParent.widthMm}mm</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive SVG Sheet Nesting Visualizer */}
          <div className="lg:col-span-2 kraft-card rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#3d3732] pb-3 mb-4">
                <h3 className="text-sm font-bold text-[#e6dfd5] uppercase tracking-wider flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-[#00a8e8]" />
                  <span>IMPOSITION SHEET CUT NESTING PREVIEW</span>
                </h3>
                <span className="text-xs text-[#8a7f70]">
                  PARENT: {selectedParent.widthMm} x {selectedParent.heightMm} mm
                </span>
              </div>

              <div className="bg-[#0e0d0c] border border-[#3d3732] rounded p-4 flex items-center justify-center min-h-[320px] relative overflow-hidden">
                <svg
                  viewBox={`0 0 ${selectedParent.widthMm} ${selectedParent.heightMm}`}
                  className="w-full max-h-[300px] border-2 border-dashed border-[#786445] bg-[#1a1715]"
                >
                  <rect x="0" y="0" width={selectedParent.widthMm} height={gripperMarginMm} fill="rgba(230, 0, 103, 0.15)" />
                  <rect x="0" y={selectedParent.heightMm - gripperMarginMm} width={selectedParent.widthMm} height={gripperMarginMm} fill="rgba(230, 0, 103, 0.15)" />

                  {grainDirection === 'LONG' ? (
                    <line x1={selectedParent.widthMm / 2} y1="25" x2={selectedParent.widthMm / 2} y2={selectedParent.heightMm - 25} stroke="rgba(0, 168, 232, 0.4)" strokeWidth="3" strokeDasharray="8 8" />
                  ) : (
                    <line x1="25" y1={selectedParent.heightMm / 2} x2={selectedParent.widthMm - 25} y2={selectedParent.heightMm / 2} stroke="rgba(230, 0, 103, 0.4)" strokeWidth="3" strokeDasharray="8 8" />
                  )}

                  {Array.from({ length: finalRows }).map((_, r) =>
                    Array.from({ length: finalCols }).map((_, c) => {
                      const itemW = isRotatedOptimal ? totalItemH : totalItemW;
                      const itemH = isRotatedOptimal ? totalItemW : totalItemH;
                      const x = gripperMarginMm + c * itemW;
                      const y = gripperMarginMm + r * itemH;
                      return (
                        <g key={`${r}-${c}`}>
                          <rect x={x} y={y} width={itemW} height={itemH} fill="#26221f" stroke="#ffd000" strokeWidth="1.5" />
                          <text x={x + itemW / 2} y={y + itemH / 2} fill="#e6dfd5" fontSize="24" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                            #{r * finalCols + c + 1}
                          </text>
                        </g>
                      );
                    })
                  )}
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-[#8a7f70] mt-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#e60067]/40 inline-block border border-[#e60067]" />
                  Gripper Margin ({gripperMarginMm}mm)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#26221f] inline-block border border-[#ffd000]" />
                  Finished Item ({finishedWidth}x{finishedHeight}mm + {bleedMm}mm Bleed)
                </span>
                <span className="text-[#00a8e8] font-bold">
                  {grainDirection === 'LONG' ? 'FIBER GRAIN ↕ VERTICAL (GL)' : 'FIBER GRAIN ↔ HORIZONTAL (GS)'}
                </span>
              </div>
            </div>

            <div className="mt-5 p-4 bg-[#141211] rounded border border-[#2e2a26] text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#e6dfd5]">
                <Compass className="w-4 h-4 text-[#ffd000]" />
                <span>GRAIN MECHANICS AUDIT</span>
              </div>
              <p className="text-[#a89f91] leading-relaxed">
                {grainDirection === 'LONG'
                  ? 'Grain Long ensures maximum dimensional stability through the press cylinders, minimizing sheet fanning-out under blanket moisture. Folding parallel to this grain will result in clean, non-cracking spine folds.'
                  : 'Grain Short orientation chosen. Warning: Folding across the grain will produce paper fiber rupture. Rotary creasing wheel scoring is required prior to folding on Stahlfolder buckle plates.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}