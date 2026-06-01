'use client';

import { motion } from 'framer-motion';
import { skillsData } from '../data/skills';
import { useViewportAnimation } from '../hooks/useViewportAnimation';

const CATEGORY_COLORS: Record<string, string> = {
  'Backend Engineering': '#3B82F6',
  'Frontend Development': '#06B6D4',
  'Cloud & DevOps': '#8B5CF6',
  'Geospatial & Remote Sensing': '#10B981',
  'Space Systems': '#F59E0B',
  'Data & Image Processing': '#10B981',
};

function ProficiencyGauge({ name, proficiency }: { name: string; proficiency: number }) {
  const totalBlocks = 10;
  const filledBlocks = Math.round((proficiency / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  const gauge = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  return (
    <div
      className="group flex items-center gap-2 py-1 px-2 rounded transition-colors duration-200 hover:bg-white/5"
      aria-label={`${name}, proficiency ${proficiency}%`}
      tabIndex={0}
      role="listitem"
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-60 shrink-0" aria-hidden="true" />
      <span className="text-space-text text-sm whitespace-nowrap">{name}</span>
      <span className="font-mono text-[11px] text-space-muted/70 group-hover:text-space-accent transition-colors duration-200 ml-auto whitespace-nowrap">
        <span aria-hidden="true">{gauge}</span>
        <span className="ml-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 text-space-accent">
          {proficiency}
        </span>
      </span>
    </div>
  );
}

function SubsystemPanel({
  category,
  skills,
  index,
}: {
  category: string;
  skills: { name: string; proficiency: number }[];
  index: number;
}) {
  const animation = useViewportAnimation({ delay: index * 0.12, duration: 0.6 });
  const color = CATEGORY_COLORS[category] || '#3B82F6';

  return (
    <motion.div
      ref={animation.ref as React.RefObject<HTMLDivElement>}
      initial={animation.initial}
      animate={animation.animate}
      transition={animation.transition as import('framer-motion').Transition}
      className="bg-space-surface/30 backdrop-blur-sm border border-space-accent/10 rounded-lg p-5 transition-colors duration-300 hover:border-space-accent/30"
    >
      {/* Subsystem Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-space-accent/10">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <h3 className="font-mono text-xs uppercase tracking-wider text-space-muted">
          {category}
        </h3>
      </div>

      {/* Skills List */}
      <div className="space-y-0.5" role="list" aria-label={`${category} skills`}>
        {skills.map((skill) => (
          <ProficiencyGauge
            key={skill.name}
            name={skill.name}
            proficiency={skill.proficiency}
          />
        ))}
      </div>
    </motion.div>
  );
}

function SatelliteIcon() {
  return (
    <svg
      className="w-5 h-5 text-space-accent/50"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13 7L9 3L5 7l4 4" />
      <path d="M17 11l4 4-4 4-4-4" />
      <path d="M8 12l4 4" />
      <path d="M16 8l-4-4" />
      <circle cx="4" cy="20" r="2" />
      <path d="M9 15l-5 5" />
    </svg>
  );
}

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="py-20 px-4 relative z-10"
      aria-label="Systems and Capabilities"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <SatelliteIcon />
            <h2 className="text-3xl sm:text-4xl font-bold text-space-text">
              Systems &amp; Capabilities
            </h2>
            <SatelliteIcon />
          </div>
          <p className="font-mono text-sm text-space-muted/70 tracking-wide">
            Technical constellation map
          </p>
        </div>

        {/* Subsystem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((categoryGroup, index) => (
            <SubsystemPanel
              key={categoryGroup.category}
              category={categoryGroup.category}
              skills={categoryGroup.skills}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
