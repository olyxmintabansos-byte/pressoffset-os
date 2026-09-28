'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scissors,
  BookOpen,
  Sparkles,
  PackageCheck,
  Truck,
  Sliders,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { usePress } from '@/context/PressContext';

interface BinderyStation {
  id: string;
  name: string;
  machine: string;
  operator: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED';
  progressPct: number;
  outputCount: number;
}

const INITIAL_STATIONS: BinderyStation[] = [
  {
    id: 'b-1',
    name: 'STATION 01 // PRECISION GUILLOTINE',
    machine: 'Polar Mohr 137 Autotrim High-Speed Cutter',
    operator: 'Klaus E.',
    status: 'COMPLETED',
    progressPct: 100,
    outputCount: 25000,
  },
  {
    id: 'b-2',
    name: 'STATION 02 // 16-PAGE SIGNATURE FOLDING',
    machine: 'Heidelberg Stahlfolder TH 82 Buckle Unit',
    operator: 'Marcus V.',
    status: 'RUNNING',
    progressPct: 68,
    outputCount: 17000,
  },
  {
    id: 'b-3',
    name: 'STATION 03 // ADHESIVE PERFECT BINDER',
    machine: 'Horizon BQ-480 4-Clamp PUR Binder',
    operator: 'Stefan B.',
    status: 'PENDING',
    progressPct: 0,
    outputCount: 0,
  },
  {
    id: 'b-4',
    name: 'STATION 04 // DIE-CUT & SPOT UV FINISHING',
    machine: 'Heidelberg Cylinder SBG + Scodix Ultra',
    operator: 'Elena R.',
    status: 'PENDING',
    progressPct: 0,
    outputCount: 0,
  },
];

export default function BinderyFinishingPage() {
  const { currentJob } = usePress();

  const [stations, setStations] = useState<BinderyStation[]>(INITIAL_STATIONS);
  const [pageCount, setPageCount] = useState<number>(192);
  const [innerGsm, setInnerGsm] = useState<number>(150);
  const [bulkFactor, setBulkFactor] = useState<number>(1.2);
  const [coverGsm, setCoverGsm] = useState<number>(350);
  const [cartonPackCount, setCartonPackCount] = useState<number>(20);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const textBlockSpineMm = (pageCount / 2) * (innerGsm / 1000) * bulkFactor;
  const coverThicknessMm = (coverGsm / 1000) * 1.5;
  const totalSpineMm = parseFloat((textBlockSpineMm + coverThicknessMm + 0.4).toFixed(2));

  const totalBooks = currentJob.totalImpressions;
  const totalCartons = Math.ceil(totalBooks / cartonPackCount);
  const palletsRequired = Math.ceil(totalCartons / 36);

  const toggleStationStatus = (id: string) => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (s.status === 'PENDING') return { ...s, status: 'RUNNING', progressPct: 45 };
        if (s.status === 'RUNNING') return { ...s, status: 'COMPLETED', progressPct: 100, outputCount: totalBooks };
        return { ...s, status: 'PENDING', progressPct: 0, outputCount: 0 };
      })
    );
  };

  const dispatchPallet = () => {
    setToastMessage(`DISPATCHED ${palletsRequired} PALLETS (${totalCartons} CARTONS) TO WAREHOUSE SKID BAY 4`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#171514] text-[#e6dfd5] pb-20 halftone-screen">
      {/* Banner */}
      <div className="bg-[#1f1c19] border-b border-[#3d3732] px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#e60067] uppercase tracking-widest mb-1">
              <Scissors className="w-4 h-4 text-[#e60067]" />
              <span>POST-PRESS CONVERTING & BINDERY WORKFLOW</span>
            </div>
            <h1 className="text-3xl font-mono font-extrabold tracking-tight text-white flex items-center gap-3">
              FINISHING & <span className="text-[#ffd000]">BINDERY DISPATCH</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#2b2520] border border-[#786445] text-[#ffd000] font-mono font-normal">
                PUR ADHESIVE & SIGNATURE DISPATCH
              </span>
            </h1>
            <p className="text-sm font-mono text-[#a89f91] mt-1">
              Automated spine caliper calculation, Polar guillotine sequencing, folding station status, and EUR-pallet shipping staging.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <Link
              href="/paper/"
              className="px-4 py-2 bg-[#2b2520] hover:bg-[#38312b] text-[#ffd000] border border-[#786445] font-bold uppercase rounded flex items-center gap-2 cursor-pointer"
            >
              <span>← PAPER CALCULATOR</span>
            </Link>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-[#1b2b1a] border-b border-emerald-500 text-emerald-300 font-mono text-xs py-2 px-4 text-center sticky top-16 z-40 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Spine Thickness Real-Time Caliper & 3D Tactile Representation */}
        <div className="kraft-card rounded-lg p-6 font-mono">
          <div className="border-b border-[#3d3732] pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#e6dfd5] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#ffd000]" />
                <span>PUR PERFECT BINDING SPINE CALIPER CALCULATOR</span>
              </h2>
              <p className="text-xs text-[#a89f91] mt-0.5">
                Exact mechanical spine thickness and hinge creasing guide for cover die-creation and jacket layout.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8a7f70] block">COMPUTED SPINE WIDTH</span>
              <strong className="text-2xl text-[#ffd000] font-extrabold">{totalSpineMm} mm</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Input Controls */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[#a89f91] block mb-1">INNER BOOK BLOCK PAGE COUNT</label>
                <input
                  type="number"
                  step="4"
                  min="16"
                  max="1024"
                  value={pageCount}
                  onChange={(e) => setPageCount(parseInt(e.target.value) || 16)}
                  className="w-full bg-[#141211] border border-[#3d3732] rounded p-2 text-[#e6dfd5] font-bold"
                />
                <span className="text-[10px] text-[#8a7f70]">Must be multiple of 4 or 16 for folded signatures</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#a89f91] block mb-1">INNER GSM</label>
                  <input
                    type="number"
                    value={innerGsm}
                    onChange={(e) => setInnerGsm(parseInt(e.target.value) || 80)}
                    className="w-full bg-[#141211] border border-[#3d3732] rounded p-2 text-[#e6dfd5] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#a89f91] block mb-1">COVER GSM</label>
                  <input
                    type="number"
                    value={coverGsm}
                    onChange={(e) => setCoverGsm(parseInt(e.target.value) || 200)}
                    className="w-full bg-[#141211] border border-[#3d3732] rounded p-2 text-[#e6dfd5] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#a89f91] block mb-1">PAPER BULK VOLUMETRIC FACTOR</label>
                <select
                  value={bulkFactor}
                  onChange={(e) => setBulkFactor(parseFloat(e.target.value))}
                  className="w-full bg-[#141211] border border-[#3d3732] rounded p-2 text-[#e6dfd5] font-bold"
                >
                  <option value={1.3}>1.30 • High-Bulk Novel Rough Cream</option>
                  <option value={1.2}>1.20 • Munken Pure Rough Premium</option>
                  <option value={1.0}>1.00 • Standard Woodfree Uncoated Offset</option>
                  <option value={0.9}>0.90 • Coated Silk / Matte Art</option>
                  <option value={0.82}>0.82 • High-Gloss Coated Magazine Stock</option>
                </select>
              </div>
            </div>

            {/* Tactile 3D Spine Graphic */}
            <div className="lg:col-span-2 bg-[#0e0d0c] border border-[#3d3732] rounded p-6 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center py-8">
                <div className="flex items-center border border-[#786445] rounded shadow-2xl bg-[#1c1917] p-1">
                  {/* Back Cover */}
                  <div className="w-28 sm:w-36 h-48 bg-[#2b2520] border-r border-[#ffd000]/40 flex flex-col justify-between p-3 text-[10px] text-[#8a7f70]">
                    <span>BACK COVER</span>
                    <span className="text-[9px]">210 x 297 mm</span>
                  </div>

                  {/* Spine Block */}
                  <div
                    className="h-48 bg-[#3d342c] border-l-2 border-r-2 border-[#ffd000] flex flex-col items-center justify-center px-1 text-center transition-all duration-300"
                    style={{ width: `${Math.max(28, totalSpineMm * 4)}px` }}
                  >
                    <span className="text-[10px] font-bold text-[#ffd000] uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
                      SPINE: {totalSpineMm} mm
                    </span>
                  </div>

                  {/* Front Cover */}
                  <div className="w-28 sm:w-36 h-48 bg-[#2b2520] border-l border-[#ffd000]/40 flex flex-col justify-between p-3 text-[10px] text-[#8a7f70]">
                    <span>FRONT COVER</span>
                    <span className="text-[#ffd000] font-bold text-[10px]">{currentJob.jobCode}</span>
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-between text-[11px] text-[#8a7f70] border-t border-[#2e2a26] pt-3">
                <span>TOTAL COVER FLAT SPREAD: {(210 * 2 + totalSpineMm).toFixed(1)} mm</span>
                <span>HINGE CREASE: 7.0mm PARALLEL TO SPINES</span>
                <span>GLUE LAYER: PUR 0.4mm THERMAL BOND</span>
              </div>
            </div>
          </div>
        </div>

        {/* Finishing Stations Workflow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
          {stations.map((st) => (
            <div key={st.id} className="kraft-card rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#ffd000]">{st.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      st.status === 'COMPLETED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : st.status === 'RUNNING'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse'
                        : 'bg-[#141211] text-[#786d5e] border border-[#3d3732]'
                    }`}
                  >
                    {st.status}
                  </span>
                </div>

                <div className="text-sm font-bold text-white mt-1">{st.machine}</div>
                <div className="text-xs text-[#8a7f70] mt-0.5">Operator on Duty: {st.operator}</div>

                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[11px] text-[#a89f91]">
                    <span>STATION COMPLETION</span>
                    <span className="font-bold text-[#e6dfd5]">{st.progressPct}%</span>
                  </div>
                  <div className="w-full bg-[#141211] h-2 rounded-full overflow-hidden border border-[#3d3732]">
                    <div
                      className={`h-full transition-all ${
                        st.status === 'COMPLETED'
                          ? 'bg-emerald-400'
                          : st.status === 'RUNNING'
                          ? 'bg-[#ffd000]'
                          : 'bg-zinc-700'
                      }`}
                      style={{ width: `${st.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#3d3732] flex items-center justify-between">
                <span className="text-xs text-[#8a7f70]">
                  Output: <strong className="text-white">{st.outputCount.toLocaleString()}</strong> units
                </span>
                <button
                  onClick={() => toggleStationStatus(st.id)}
                  className="px-3 py-1.5 bg-[#2b2520] hover:bg-[#38312b] border border-[#786445] text-[#ffd000] text-xs font-bold rounded cursor-pointer"
                >
                  TOGGLE STATUS
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Palletizing & Logistics Staging */}
        <div className="kraft-card rounded-lg p-6 font-mono">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3d3732] pb-4 mb-5">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#ffd000] font-bold flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#ffd000]" /> PALLET PACKAGING & DISPATCH MANIFEST
              </span>
              <p className="text-xs text-[#a89f91] mt-0.5">
                Carton strapping, skid palletization, and shipping manifest generation for Atelier Gutenberg Fine Press.
              </p>
            </div>
            <button
              onClick={dispatchPallet}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold uppercase rounded flex items-center gap-2 shadow-md cursor-pointer"
            >
              <PackageCheck className="w-4 h-4" />
              <span>DISPATCH PALLETS NOW</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#141211] p-3 rounded border border-[#2e2a26]">
              <span className="text-[#8a7f70] block">BOOKS PER CARTON</span>
              <input
                type="number"
                value={cartonPackCount}
                onChange={(e) => setCartonPackCount(parseInt(e.target.value) || 5)}
                className="w-full bg-[#1c1917] border border-[#3d3732] rounded p-1.5 text-white font-bold mt-1"
              />
            </div>

            <div className="bg-[#141211] p-3 rounded border border-[#2e2a26]">
              <span className="text-[#8a7f70] block">TOTAL MASTER CARTONS</span>
              <strong className="text-lg text-white font-bold block mt-1">{totalCartons.toLocaleString()} CARTONS</strong>
              <span className="text-[10px] text-[#8a7f70]">Heavy-duty 5-ply corrugated</span>
            </div>

            <div className="bg-[#141211] p-3 rounded border border-[#2e2a26]">
              <span className="text-[#8a7f70] block">EUR-PALLET COUNT</span>
              <strong className="text-lg text-[#00a8e8] font-bold block mt-1">{palletsRequired} PALLETS</strong>
              <span className="text-[10px] text-[#8a7f70]">36 cartons / skid (1.4m height)</span>
            </div>

            <div className="bg-[#141211] p-3 rounded border border-[#2e2a26]">
              <span className="text-[#8a7f70] block">EST. FREIGHT WEIGHT</span>
              <strong className="text-lg text-emerald-400 font-bold block mt-1">
                {(totalBooks * (textBlockSpineMm * 0.08 + 0.15)).toFixed(0)} kg
              </strong>
              <span className="text-[10px] text-[#8a7f70]">Shrink-wrapped & strapped</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}