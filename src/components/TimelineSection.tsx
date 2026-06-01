'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { experienceData, ExperienceEntry } from '../data/experience';
import { useViewportAnimation } from '../hooks/useViewportAnimation';
import { useReducedMotion } from '../hooks/useReducedMotion';

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

/**
 * Parses a date string in "MMM YYYY" format to a Date object.
 * Returns epoch (Jan 1970) for invalid formats.
 */
export function parseStartDate(dateStr: string): Date {
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length !== 2) return new Date(0);
  const [month, yearStr] = parts;
  const monthIndex = MONTHS[month];
  const year = parseInt(yearStr, 10);
  if (monthIndex === undefined || isNaN(year)) return new Date(0);
  return new Date(year, monthIndex, 1);
}

/**
 * Sorts experience entries by startDate in descending order (most recent first).
 */
export function sortExperienceByDate(entries: ExperienceEntry[]): ExperienceEntry[] {
  return [...entries].sort((a, b) => {
    const dateA = parseStartDate(a.startDate);
    const dateB = parseStartDate(b.startDate);
    return dateB.getTime() - dateA.getTime();
  });
}

/** Mission phase metadata mapped to experience entries */
const MISSION_PHASES: Record<string, { phase: string; codename: string }> = {
  cognizant: { phase: '01', codename: 'GROUND OPERATIONS' },
  amazon: { phase: '02', codename: 'PRE-FLIGHT CHECK' },
  azista: { phase: '03', codename: 'LAUNCH' },
  kaleideo: { phase: '04', codename: 'ORBITAL OPERATIONS' },
};

/** Trajectory SVG path connecting mission nodes */
function TrajectoryPath({ nodeCount }: { nodeCount: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });
  const prefersReducedMotion = useReducedMotion();

  // Build a curved path that flows through node positions
  const height = nodeCount * 280;
  const pathD = buildTrajectoryPath(nodeCount, height);

  return (
    <svg
      ref={ref}
      className="absolute left-6 top-0 bottom-0 w-12 h-full hidden md:block"
      style={{ height: `${height}px` }}
      viewBox={`0 0 48 ${height}`}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Background path (static) */}
      <path
        d={pathD}
        stroke="currentColor"
        className="text-space-accent/10"
        strokeWidth="2"
        fill="none"
      />
      {/* Animated dashed path */}
      <motion.path
        d={pathD}
        stroke="currentColor"
        className="text-space-accent/40"
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 6"
        initial={{ pathLength: 0 }}
        animate={isInView && !prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      {/* Flowing dash animation overlay */}
      {!prefersReducedMotion && (
        <path
          d={pathD}
          stroke="currentColor"
          className="text-space-accent/20 animate-dash-flow"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 12"
        />
      )}
    </svg>
  );
}

function buildTrajectoryPath(nodeCount: number, height: number): string {
  const segmentHeight = height / nodeCount;
  let d = `M 24 0`;

  for (let i = 0; i < nodeCount; i++) {
    const y = i * segmentHeight;
    const nextY = (i + 1) * segmentHeight;
    const midY = (y + nextY) / 2;
    const curveOffset = i % 2 === 0 ? 12 : -12;

    d += ` C ${24 + curveOffset} ${midY - segmentHeight * 0.2}, ${24 - curveOffset} ${midY + segmentHeight * 0.2}, 24 ${nextY}`;
  }

  return d;
}

/** Mobile vertical line (simple fallback) */
function MobileTrajectoryLine() {
  return (
    <div
      className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-space-accent/5 via-space-accent/30 to-space-accent/5 md:hidden"
      aria-hidden="true"
    />
  );
}

/** Mission node marker on the trajectory */
function MissionNode({ isCurrent, index }: { isCurrent: boolean; index: number }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute left-4 md:left-6 top-4 -translate-x-1/2 md:translate-x-0 z-10">
      <div className="relative flex items-center justify-center">
        {/* Radar pulse for current role */}
        {isCurrent && !prefersReducedMotion && (
          <>
            <span className="absolute w-6 h-6 rounded-full bg-space-success/20 animate-ping" />
            <span className="absolute w-4 h-4 rounded-full bg-space-success/30 animate-pulse" />
          </>
        )}
        {/* Node dot */}
        <span
          className={`relative w-3 h-3 rounded-full border-2 z-10 ${
            isCurrent
              ? 'bg-space-success border-space-success shadow-lg shadow-space-success/30'
              : 'bg-space-bg border-space-accent'
          }`}
        />
        {/* Phase number label */}
        <span className="absolute left-6 md:left-5 text-[10px] font-mono text-space-muted whitespace-nowrap">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

/** Individual mission phase card */
function PhaseCard({
  entry,
  index,
  totalEntries,
}: {
  entry: ExperienceEntry;
  index: number;
  totalEntries: number;
}) {
  const phaseInfo = MISSION_PHASES[entry.id] || {
    phase: String(index + 1).padStart(2, '0'),
    codename: 'MISSION PHASE',
  };

  const animation = useViewportAnimation({
    delay: index * 0.15,
    duration: 0.5,
    direction: 'up',
  });

  // Reverse index for display (oldest = Phase 01)
  const displayPhase = String(totalEntries - index).padStart(2, '0');
  const displayCodename = phaseInfo.codename;

  return (
    <div className="relative pl-12 md:pl-20 pb-12 last:pb-0">
      {/* Mission node on trajectory */}
      <MissionNode isCurrent={entry.isCurrent} index={totalEntries - 1 - index} />

      {/* Phase card */}
      <motion.div
        ref={animation.ref as React.RefObject<HTMLDivElement>}
        initial={animation.initial}
        animate={animation.animate}
        transition={animation.transition as import('framer-motion').Transition}
        className={`bg-space-surface/30 backdrop-blur-sm border rounded-lg p-5 sm:p-6 transition-colors ${
          entry.isCurrent
            ? 'border-space-accent/30 shadow-lg shadow-space-accent/5'
            : 'border-space-accent/10'
        }`}
      >
        {/* Phase label */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[11px] text-space-muted tracking-wider uppercase">
            Phase {displayPhase}: {displayCodename}
          </span>
          {entry.isCurrent && (
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-space-success border border-space-success/30 bg-space-success/5 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-space-success animate-pulse" />
              ACTIVE
            </span>
          )}
        </div>

        {/* Company name */}
        <h3 className="text-lg sm:text-xl font-semibold text-space-text mb-1">
          {entry.company}
        </h3>

        {/* Designation */}
        <p className="font-mono text-xs text-space-accent mb-1">
          DESIGNATION: {entry.role}
        </p>

        {/* Mission window */}
        <p className="font-mono text-[11px] text-space-muted mb-4">
          MISSION WINDOW: {entry.startDate} – {entry.endDate ?? 'Present'}
        </p>

        {/* Description */}
        <p className="text-space-muted text-sm leading-relaxed mb-4">
          {entry.description}
        </p>

        {/* Achievements */}
        {entry.achievements && entry.achievements.length > 0 && (
          <ul className="space-y-2">
            {entry.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-space-muted">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-space-accent/60 shrink-0" />
                <span className="leading-relaxed">{achievement}</span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

export default function TimelineSection() {
  const sortedEntries = sortExperienceByDate(experienceData);

  return (
    <section
      id="experience"
      className="py-20 px-4 relative z-10"
      aria-label="Experience Timeline"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-space-text mb-2">
            Mission Trajectory
          </h2>
          <p className="font-mono text-sm text-space-muted">
            Career progression through mission phases
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative">
          {/* Trajectory path (desktop) */}
          <TrajectoryPath nodeCount={sortedEntries.length} />

          {/* Mobile vertical line */}
          <MobileTrajectoryLine />

          {/* Phase cards */}
          <div>
            {sortedEntries.map((entry, index) => (
              <PhaseCard
                key={entry.id}
                entry={entry}
                index={index}
                totalEntries={sortedEntries.length}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
