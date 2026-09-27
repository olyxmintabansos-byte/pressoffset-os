'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Printer,
  Gauge,
  Layers,
  Settings,
  Sliders,
  Play,
  Square,
  Crosshair,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { usePress } from '@/context/PressContext';

export function Navbar() {
  const pathname = usePathname();
  const { currentJob, isPressRunning, togglePressRun, plates } = usePress();

  const allPlatesAligned = Object.values(plates).every((p) => p.isAligned);

  const navLinks = [
    { href: '/', label: 'PRESS COCKPIT', sub: 'SPEEDMASTER B1' },
    { href: '/plates/', label: 'CTP & DENSITOMETER', sub: 'PLATE REGISTRATION' },
    { href: '/paper/', label: 'PAPER CALCULATOR', sub: 'GRAIN & YIELD' },
    { href: '/bindery/', label: 'FINISHING & BINDERY', sub: 'DIE-CUT & FOLD' },
  ];

  const pctProgress = Math.round(
    (currentJob.completedImpressions / currentJob.totalImpressions) * 100
  );

  return (
    <header className="sticky top-0 z-50 bg-[#161413]/95 backdrop-blur-md border-b border-[#3d3732] halftone-cmyk-dense">
      {/* Top Mechanical Press Telemetry Bar */}
      <div className="bg-[#0e0d0c] border-b border-[#2b2723] px-4 py-1 text-xs flex flex-wrap items-center justify-between text-[#a89f91]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a8e8] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#e60067] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffd000] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b1917] border border-[#a89f91] inline-block" />
            <span className="font-bold text-[#e6dfd5] tracking-widest text-[11px] ml-1">
              PRESS #04 • HEIDELBERG SPEEDMASTER XL 106-8-P
            </span>
          </div>
          <span className="hidden md:inline-block text-[#474037]">|</span>
          <span className="hidden md:inline-block text-[11px]">
            JOB: <strong className="text-[#e6dfd5]">{currentJob.jobCode}</strong> ({currentJob.client})
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 bg-[#1b1816] px-2.5 py-0.5 rounded border border-[#3d3732]">
            <span className="text-[#7d7568]">REGISTRATION:</span>
            <span className={`font-bold flex items-center gap-1 ${allPlatesAligned ? 'text-emerald-400' : 'text-amber-400'}`}>
              <Crosshair className="w-3 h-3" />
              {allPlatesAligned ? 'PERFECT 0.00mm' : 'ALIGNMENT REQ'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1b1816] px-2.5 py-0.5 rounded border border-[#3d3732]">
            <span className="text-[#7d7568]">SPEED:</span>
            <span className="font-bold text-[#ffd000]">
              {isPressRunning ? `${currentJob.runSpeedSPH.toLocaleString()} SPH` : '0 SPH (PAUSED)'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded bg-[#211e1c] border border-[#786445] flex items-center justify-center shadow-md group-hover:border-[#c29d59] transition-all">
              <Printer className="w-5 h-5 text-[#c29d59]" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-wider text-[#e6dfd5] flex items-center gap-1.5">
                PRESS<span className="text-[#00a8e8]">OFFSET</span>
                <span className="text-[10px] tracking-widest px-1.5 bg-[#e60067]/20 text-[#e60067] border border-[#e60067]/40 rounded-xs">
                  CMYK
                </span>
              </div>
              <div className="text-[9px] tracking-widest text-[#8a7f70] uppercase">
                TITAN #38 • COMMERCIAL OFFSET PRESS MANAGEMENT
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col px-3.5 py-1.5 rounded transition-all border ${
                    isActive
                      ? 'bg-[#2b2520] text-[#ffd000] border-[#786445] shadow-inner'
                      : 'text-[#a89f91] hover:text-[#e6dfd5] hover:bg-[#211e1c] border-transparent'
                  }`}
                >
                  <span className="text-xs font-bold tracking-wider">{item.label}</span>
                  <span className="text-[9px] text-[#786d5e] tracking-tight">{item.sub}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-xs pr-2">
              <div className="text-[10px] text-[#8a7f70]">IMPRESSIONS COMPLETED</div>
              <div className="font-bold text-[#e6dfd5]">
                {currentJob.completedImpressions.toLocaleString()} / {currentJob.totalImpressions.toLocaleString()}{' '}
                <span className="text-[#ffd000]">({pctProgress}%)</span>
              </div>
            </div>

            <button
              onClick={togglePressRun}
              className={`px-3.5 py-1.5 font-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isPressRunning
                  ? 'bg-[#e60067] hover:bg-[#c20056] text-white shadow-[#e60067]/30'
                  : 'bg-[#ffd000] hover:bg-[#e6bb00] text-black shadow-[#ffd000]/30'
              }`}
            >
              {isPressRunning ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPressRunning ? 'STOP PRESS' : 'START RUN'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}