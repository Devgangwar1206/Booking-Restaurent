'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Trees,
  Heart,
  Filter,
  Info,
} from 'lucide-react';

/**
 * FloorPlan Component - Crisp, Modern Light Theme Architectural Layout
 * 
 * High-Contrast, Intuitive & Responsive:
 * - Emerald Green: Available for Booking
 * - Radiant Rose/Crimson: Currently Selected Table
 * - Warm Amber: 5-Minute Temporary Hold
 * - Soft Slate Gray: Reserved/Booked
 */
export default function FloorPlan({
  tables = [],
  selectedTableId,
  onSelectTable,
  guestCount = 2,
  isLoading = false,
  containerClassName = '',
  selectedZone = 'ALL',
  onSelectZone = null,
}) {
  const [hoveredTableId, setHoveredTableId] = useState(null);
  const [activeZone, setActiveZone] = useState(selectedZone || 'ALL');

  const displayTables = tables && tables.length > 0 ? tables : [
    { id: 1, tableNumber: 'T-01', name: 'Terrace A', capacity: 4, shape: 'rect', zone: 'North Terrace', status: 'AVAILABLE', suitableForGuests: true },
    { id: 2, tableNumber: 'T-02', name: 'Terrace B', capacity: 4, shape: 'rect', zone: 'North Terrace', status: 'AVAILABLE', suitableForGuests: true },
    { id: 6, tableNumber: 'T-06', name: "Chef's Round", capacity: 6, shape: 'round', zone: 'Center Lounge', status: 'AVAILABLE', suitableForGuests: true },
    { id: 7, tableNumber: 'T-07', name: 'Grand Round', capacity: 6, shape: 'round', zone: 'Center Lounge', status: 'AVAILABLE', suitableForGuests: true },
    { id: 3, tableNumber: 'T-03', name: 'Alcove 1', capacity: 2, shape: 'booth', zone: 'Wall Alcove', status: 'AVAILABLE', suitableForGuests: true },
    { id: 4, tableNumber: 'T-04', name: 'Alcove 2', capacity: 2, shape: 'booth', zone: 'Wall Alcove', status: 'AVAILABLE', suitableForGuests: true },
    { id: 5, tableNumber: 'T-05', name: 'Alcove 3', capacity: 2, shape: 'booth', zone: 'Wall Alcove', status: 'AVAILABLE', suitableForGuests: true },
    { id: 8, tableNumber: 'T-08', name: 'Wine Alcove 1', capacity: 2, shape: 'booth', zone: 'Wall Alcove', status: 'AVAILABLE', suitableForGuests: true },
    { id: 9, tableNumber: 'T-09', name: 'Wine Alcove 2', capacity: 2, shape: 'booth', zone: 'Wall Alcove', status: 'AVAILABLE', suitableForGuests: true },
    { id: 10, tableNumber: 'T-10', name: 'Wine Alcove 3', capacity: 2, shape: 'booth', zone: 'Wall Alcove', status: 'AVAILABLE', suitableForGuests: true },
  ];

  const handleZoneClick = (zoneKey) => {
    setActiveZone(zoneKey);
    if (onSelectZone) onSelectZone(zoneKey);
  };

  const getTable = (id) => displayTables.find((t) => t.id === id) || {
    id,
    tableNumber: `T-${id}`,
    capacity: 4,
    status: 'AVAILABLE',
    suitableForGuests: true,
  };

  const hoveredTable = displayTables.find((t) => t.id === hoveredTableId);

  const isTableInActiveZone = (table) => {
    if (activeZone === 'ALL') return true;
    if (activeZone === 'CENTER' && table.shape === 'round') return true;
    if (activeZone === 'TERRACE' && table.shape === 'rect') return true;
    if (activeZone === 'ALCOVE' && table.shape === 'booth') return true;
    return false;
  };

  // 1. Render Round Tables (Center Lounge: T-06 and T-07)
  const renderRoundTable = (tableId, cx, cy, r = 38) => {
    const table = getTable(tableId);
    const isReserved = table.status === 'RESERVED';
    const isHeld = table.status === 'HELD';
    const isHeldByMe = isHeld && Boolean(table.heldByCurrentSession);
    const isSelected = selectedTableId === table.id && table.status === 'AVAILABLE';
    const inFilter = isTableInActiveZone(table);
    const isHovered = hoveredTableId === table.id;

    const chairAngles = [-90, -30, 30, 90, 150, 210];
    const chairDistance = r + 13;

    // Light Theme Colors
    let chairFill = '#e2e8f0';
    let chairStroke = '#cbd5e1';
    let tableFill = '#ffffff';
    let tableStroke = '#10b981';
    let textColor = '#0f172a';
    let subtextColor = '#059669';

    if (isHeld) {
      // 5-Minute Hold is ALWAYS pure Yellow / Golden Amber
      chairFill = '#f59e0b';
      chairStroke = '#fde68a';
      tableFill = '#fffbeb';
      tableStroke = '#f59e0b';
      textColor = '#78350f';
      subtextColor = '#b45309';
    } else if (isReserved) {
      chairFill = '#f1f5f9';
      chairStroke = '#e2e8f0';
      tableFill = '#f8fafc';
      tableStroke = '#cbd5e1';
      textColor = '#94a3b8';
      subtextColor = '#94a3b8';
    } else if (isSelected) {
      chairFill = '#f43f5e';
      chairStroke = '#fda4af';
      tableFill = '#fff1f2';
      tableStroke = '#e11d48';
      textColor = '#881337';
      subtextColor = '#be123c';
    } else if (isHovered) {
      tableFill = '#f0fdf4';
      tableStroke = '#059669';
      chairStroke = '#059669';
    }

    const opacity = inFilter ? 1 : 0.25;

    return (
      <g
        key={`table-round-${table.id}`}
        opacity={opacity}
        className={`transition-all duration-200 ${!isReserved && !isHeld ? 'cursor-pointer hover:scale-[1.03]' : 'cursor-pointer'}`}
        onClick={() => onSelectTable(table)}
        onMouseEnter={() => setHoveredTableId(table.id)}
        onMouseLeave={() => setHoveredTableId(null)}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {/* Soft selected glow */}
        {(isSelected || isHovered) && (
          <circle
            cx={cx}
            cy={cy}
            r={r + 22}
            fill={isSelected ? '#e11d48' : '#10b981'}
            fillOpacity={isSelected ? 0.15 : 0.08}
            className={isSelected ? 'animate-pulse' : ''}
          />
        )}

        {/* Chairs */}
        {chairAngles.map((angleDeg, idx) => {
          const angleRad = (angleDeg * Math.PI) / 180;
          const chairX = cx + chairDistance * Math.cos(angleRad);
          const chairY = cy + chairDistance * Math.sin(angleRad);
          const chairW = 22;
          const chairH = 11;

          return (
            <g
              key={`chair-${table.id}-${idx}`}
              transform={`translate(${chairX}, ${chairY}) rotate(${angleDeg + 90})`}
            >
              <rect
                x={-chairW / 2}
                y={-chairH / 2}
                width={chairW}
                height={chairH}
                rx={4}
                fill={chairFill}
                stroke={chairStroke}
                strokeWidth={1.2}
              />
            </g>
          );
        })}

        {/* Circular Table Top */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={tableFill}
          stroke={tableStroke}
          strokeWidth={isSelected ? 3 : 2}
          className="transition-colors duration-200"
        />

        {/* Table Number & Capacity */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill={textColor}
          fontSize={13}
          fontWeight="900"
          className="select-none pointer-events-none font-mono"
        >
          {table.tableNumber}
        </text>

        <text
          x={cx}
          y={cy + 13}
          textAnchor="middle"
          fill={subtextColor}
          fontSize={9}
          fontWeight="800"
          className="select-none pointer-events-none uppercase font-sans tracking-wider"
        >
          {isReserved ? 'BOOKED' : isHeld ? 'HELD' : isSelected ? 'SELECTED' : `${table.capacity} SEATS`}
        </text>
      </g>
    );
  };

  // 2. Render Rectangular Tables (North Terrace: T-01, T-02)
  const renderRectTable = (tableId, cx, cy, width = 84, height = 46) => {
    const table = getTable(tableId);
    const isReserved = table.status === 'RESERVED';
    const isHeld = table.status === 'HELD';
    const isHeldByMe = isHeld && Boolean(table.heldByCurrentSession);
    const isSelected = selectedTableId === table.id && table.status === 'AVAILABLE';
    const inFilter = isTableInActiveZone(table);
    const isHovered = hoveredTableId === table.id;

    // Light Theme Colors
    let chairFill = '#e2e8f0';
    let chairStroke = '#cbd5e1';
    let tableFill = '#ffffff';
    let tableStroke = '#10b981';
    let textColor = '#0f172a';
    let subtextColor = '#059669';

    if (isHeld) {
      // 5-Minute Hold is ALWAYS pure Yellow / Golden Amber
      chairFill = '#f59e0b';
      chairStroke = '#fde68a';
      tableFill = '#fffbeb';
      tableStroke = '#f59e0b';
      textColor = '#78350f';
      subtextColor = '#b45309';
    } else if (isReserved) {
      chairFill = '#f1f5f9';
      chairStroke = '#e2e8f0';
      tableFill = '#f8fafc';
      tableStroke = '#cbd5e1';
      textColor = '#94a3b8';
      subtextColor = '#94a3b8';
    } else if (isSelected) {
      chairFill = '#f43f5e';
      chairStroke = '#fda4af';
      tableFill = '#fff1f2';
      tableStroke = '#e11d48';
      textColor = '#881337';
      subtextColor = '#be123c';
    } else if (isHovered) {
      tableFill = '#f0fdf4';
      tableStroke = '#059669';
      chairStroke = '#059669';
    }

    const opacity = inFilter ? 1 : 0.25;

    // 4 chairs (2 top, 2 bottom)
    const topChairs = [
      { x: cx - width / 4, y: cy - height / 2 - 8 },
      { x: cx + width / 4, y: cy - height / 2 - 8 },
    ];
    const bottomChairs = [
      { x: cx - width / 4, y: cy + height / 2 + 8 },
      { x: cx + width / 4, y: cy + height / 2 + 8 },
    ];

    return (
      <g
        key={`table-rect-${table.id}`}
        opacity={opacity}
        className={`transition-all duration-200 ${!isReserved && !isHeld ? 'cursor-pointer hover:scale-[1.03]' : 'cursor-pointer'}`}
        onClick={() => onSelectTable(table)}
        onMouseEnter={() => setHoveredTableId(table.id)}
        onMouseLeave={() => setHoveredTableId(null)}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {/* Soft selected glow */}
        {(isSelected || isHovered) && (
          <rect
            x={cx - width / 2 - 12}
            y={cy - height / 2 - 16}
            width={width + 24}
            height={height + 32}
            rx={16}
            fill={isSelected ? '#e11d48' : '#10b981'}
            fillOpacity={isSelected ? 0.15 : 0.08}
            className={isSelected ? 'animate-pulse' : ''}
          />
        )}

        {/* Top Chairs */}
        {topChairs.map((ch, idx) => (
          <rect
            key={`top-chair-${table.id}-${idx}`}
            x={ch.x - 11}
            y={ch.y - 5}
            width={22}
            height={10}
            rx={3}
            fill={chairFill}
            stroke={chairStroke}
            strokeWidth={1.2}
          />
        ))}

        {/* Bottom Chairs */}
        {bottomChairs.map((ch, idx) => (
          <rect
            key={`bottom-chair-${table.id}-${idx}`}
            x={ch.x - 11}
            y={ch.y - 5}
            width={22}
            height={10}
            rx={3}
            fill={chairFill}
            stroke={chairStroke}
            strokeWidth={1.2}
          />
        ))}

        {/* Table top */}
        <rect
          x={cx - width / 2}
          y={cy - height / 2}
          width={width}
          height={height}
          rx={8}
          fill={tableFill}
          stroke={tableStroke}
          strokeWidth={isSelected ? 3 : 2}
        />

        {/* Table number & capacity */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill={textColor}
          fontSize={13}
          fontWeight="900"
          className="select-none pointer-events-none font-mono"
        >
          {table.tableNumber}
        </text>

        <text
          x={cx}
          y={cy + 13}
          textAnchor="middle"
          fill={subtextColor}
          fontSize={9}
          fontWeight="800"
          className="select-none pointer-events-none uppercase font-sans tracking-wider"
        >
          {isReserved ? 'BOOKED' : isHeld ? 'HELD' : isSelected ? 'SELECTED' : `${table.capacity} SEATS`}
        </text>
      </g>
    );
  };

  // 3. Render Cozy Booths (Left Wall: T-03, T-04, T-05; Right Wall: T-08, T-09, T-10)
  const renderBoothTable = (tableId, cx, cy, width = 34, height = 56, isLeftWall = true) => {
    const table = getTable(tableId);
    const isReserved = table.status === 'RESERVED';
    const isHeld = table.status === 'HELD';
    const isHeldByMe = isHeld && Boolean(table.heldByCurrentSession);
    const isSelected = selectedTableId === table.id && table.status === 'AVAILABLE';
    const inFilter = isTableInActiveZone(table);
    const isHovered = hoveredTableId === table.id;

    // Light Theme Colors
    let boothFill = '#f1f5f9';
    let boothStroke = '#cbd5e1';
    let tableFill = '#ffffff';
    let tableStroke = '#10b981';
    let textColor = '#0f172a';
    let subtextColor = '#059669';

    if (isHeld) {
      // 5-Minute Hold is ALWAYS pure Yellow / Golden Amber
      boothFill = '#fef3c7';
      boothStroke = '#f59e0b';
      tableFill = '#fffbeb';
      tableStroke = '#f59e0b';
      textColor = '#78350f';
      subtextColor = '#b45309';
    } else if (isReserved) {
      boothFill = '#f8fafc';
      boothStroke = '#e2e8f0';
      tableFill = '#f1f5f9';
      tableStroke = '#cbd5e1';
      textColor = '#94a3b8';
      subtextColor = '#94a3b8';
    } else if (isSelected) {
      boothFill = '#ffe4e6';
      boothStroke = '#f43f5e';
      tableFill = '#fff1f2';
      tableStroke = '#e11d48';
      textColor = '#881337';
      subtextColor = '#be123c';
    } else if (isHovered) {
      tableFill = '#f0fdf4';
      tableStroke = '#059669';
    }

    const opacity = inFilter ? 1 : 0.25;

    return (
      <g
        key={`table-booth-${table.id}`}
        opacity={opacity}
        className={`transition-all duration-200 ${!isReserved && !isHeld ? 'cursor-pointer hover:scale-[1.03]' : 'cursor-pointer'}`}
        onClick={() => onSelectTable(table)}
        onMouseEnter={() => setHoveredTableId(table.id)}
        onMouseLeave={() => setHoveredTableId(null)}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {(isSelected || isHovered) && (
          <rect
            x={cx - width / 2 - 8}
            y={cy - height / 2 - 8}
            width={width + 16}
            height={height + 16}
            rx={10}
            fill={isSelected ? '#e11d48' : '#10b981'}
            fillOpacity={isSelected ? 0.15 : 0.08}
            className={isSelected ? 'animate-pulse' : ''}
          />
        )}

        {/* Booth backrest */}
        <path
          d={
            isLeftWall
              ? `M ${cx - width / 2 - 5} ${cy - height / 2 - 4} L ${cx + width / 2 + 5} ${cy - height / 2 - 4} L ${cx + width / 2 + 5} ${cy - height / 2 + 4} L ${cx - width / 2} ${cy - height / 2 + 4} L ${cx - width / 2} ${cy + height / 2 - 4} L ${cx + width / 2 + 5} ${cy + height / 2 - 4} L ${cx + width / 2 + 5} ${cy + height / 2 + 4} L ${cx - width / 2 - 5} ${cy + height / 2 + 4} Z`
              : `M ${cx + width / 2 + 5} ${cy - height / 2 - 4} L ${cx - width / 2 - 5} ${cy - height / 2 - 4} L ${cx - width / 2 - 5} ${cy - height / 2 + 4} L ${cx + width / 2} ${cy - height / 2 + 4} L ${cx + width / 2} ${cy + height / 2 - 4} L ${cx - width / 2 - 5} ${cy + height / 2 - 4} L ${cx - width / 2 - 5} ${cy + height / 2 + 4} L ${cx + width / 2 + 5} ${cy + height / 2 + 4} Z`
          }
          fill={boothFill}
          stroke={boothStroke}
          strokeWidth={1.2}
        />

        {/* Table top */}
        <rect
          x={cx - width / 2}
          y={cy - height / 2 + 5}
          width={width}
          height={height - 10}
          rx={5}
          fill={tableFill}
          stroke={tableStroke}
          strokeWidth={isSelected ? 3 : 2}
        />

        {/* Table number */}
        <text
          x={cx}
          y={cy - 3}
          textAnchor="middle"
          fill={textColor}
          fontSize={11.5}
          fontWeight="900"
          className="select-none pointer-events-none font-mono"
        >
          {table.tableNumber}
        </text>

        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill={subtextColor}
          fontSize={9}
          fontWeight="800"
          className="select-none pointer-events-none uppercase font-sans tracking-wider"
        >
          {isReserved ? 'BOOKED' : isHeld ? 'HELD' : isSelected ? 'SELECTED' : `${table.capacity}p`}
        </text>
      </g>
    );
  };

  return (
    <div className={`relative w-full h-full flex flex-col justify-between overflow-hidden ${containerClassName}`}>
      {/* Top Filter Chips */}
      <div className="w-full flex items-center justify-between gap-2 mb-2 px-1 text-xs shrink-0">
        <span className="hidden sm:flex items-center gap-1.5 text-stone-500 font-bold uppercase tracking-wider text-[11px]">
          <Filter className="w-3.5 h-3.5 text-rose-500" />
          Filter Zone:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full sm:w-auto">
          {[
            { key: 'ALL', label: 'All Tables (10)' },
            { key: 'CENTER', label: 'Center Lounge', icon: Sparkles },
            { key: 'TERRACE', label: 'Terrace', icon: Trees },
            { key: 'ALCOVE', label: 'Wall Booths', icon: Heart },
          ].map((z) => {
            const Icon = z.icon;
            const isActive = activeZone === z.key;
            return (
              <button
                key={z.key}
                type="button"
                onClick={() => handleZoneClick(z.key)}
                className={`py-1.5 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border shadow-2xs ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-500 font-bold'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                {Icon && <Icon className="w-3 h-3 text-amber-500" />}
                <span>{z.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Floor Plan Canvas - Clean Light Porcelain Finish */}
      <div className="relative w-full flex-1 min-h-0 select-none overflow-hidden flex flex-col justify-between p-3 bg-stone-50/80 rounded-2xl border border-stone-200/90 shadow-inner">
        {/* Top marker */}
        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-stone-500 uppercase pointer-events-none border-b border-stone-200 pb-2 shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            North Garden Terrace
          </span>
          <span className="text-stone-400">Main Restaurant Entrance</span>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-20 backdrop-blur-xs rounded-2xl">
            <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mb-1.5" />
            <p className="text-xs font-bold text-stone-800">Checking live availability...</p>
          </div>
        )}

        {/* SVG Table layout */}
        <div className="relative flex-1 min-h-0 w-full flex items-center justify-center py-1">
          <svg
            viewBox="0 0 330 540"
            className="w-full h-full max-h-full drop-shadow-sm"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Top Row: Terrace Tables */}
            {renderRectTable(1, 95, 60, 84, 46)}
            {renderRectTable(2, 235, 60, 84, 46)}

            {/* Left Wall Booths */}
            {renderBoothTable(3, 40, 185, 34, 56, true)}
            {renderBoothTable(4, 40, 295, 34, 56, true)}
            {renderBoothTable(5, 40, 405, 34, 56, true)}

            {/* Center Lounge Rounds */}
            {renderRoundTable(6, 165, 225, 38)}
            {renderRoundTable(7, 165, 385, 38)}

            {/* Right Wall Booths */}
            {renderBoothTable(8, 290, 185, 34, 56, false)}
            {renderBoothTable(9, 290, 295, 34, 56, false)}
            {renderBoothTable(10, 290, 405, 34, 56, false)}
          </svg>
        </div>

        {/* Bottom marker */}
        <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-stone-500 uppercase pointer-events-none pt-2 border-t border-stone-200 shrink-0">
          <span>Private Wine Cellar</span>
          <span>Open Kitchen Bar</span>
          <span>Cocktail Lounge</span>
        </div>

        {/* Hover info tooltip */}
        <AnimatePresence>
          {hoveredTable && (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              className="mt-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs flex items-center justify-between shadow-lg border border-stone-700 shrink-0"
            >
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-rose-400 font-mono">{hoveredTable.tableNumber}</span>
                <span className="text-white font-semibold">{hoveredTable.name}</span>
                <span className="text-stone-300">
                  · {hoveredTable.capacity} Seats {guestCount > hoveredTable.capacity ? `(Joined seating for ${guestCount})` : ''}
                </span>
              </div>
              <div>
                {hoveredTable.status === 'RESERVED' && <span className="text-stone-400 font-bold">Booked for this time</span>}
                {hoveredTable.status === 'HELD' && <span className="text-amber-400 font-bold">Temporarily Held</span>}
                {hoveredTable.status === 'AVAILABLE' && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tap to Select
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
