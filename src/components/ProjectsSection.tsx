'use client';

import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import { useViewportAnimation } from '../hooks/useViewportAnimation';
import type { Project } from '../data/projects';

function getCompanyAttribution(id: string): string {
  if (id.startsWith('azista-')) return '@ Azista Industries';
  if (id.startsWith('kaleideo-')) return '@ Kaleideo Space Systems';
  return '';
}

function FeaturedMissionPanel({ project, index }: { project: Project; index: number }) {
  const animation = useViewportAnimation({ delay: index * 0.15, direction: 'up' });

  return (
    <motion.article
      ref={animation.ref as React.RefObject<HTMLDivElement>}
      initial={animation.initial}
      animate={animation.animate}
      transition={animation.transition as import('framer-motion').Transition}
      className="relative group col-span-1 md:col-span-2 bg-space-surface/30 backdrop-blur-sm border border-space-accent/10 rounded-lg p-8 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:border-space-accent/30 transition-all duration-300"
      aria-label={`Featured project: ${project.name}`}
    >
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-lg border border-space-accent/10 animate-glow-pulse pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] tracking-widest uppercase text-space-accent bg-space-accent/10 border border-space-accent/20 rounded px-2 py-0.5">
          Featured System
        </span>
        <span className="font-mono text-[10px] text-space-muted tracking-wide">
          {getCompanyAttribution(project.id)}
        </span>
      </div>

      {/* System Name */}
      <h3 className="text-xl font-semibold text-space-text mb-3">{project.name}</h3>

      {/* System Brief */}
      <p className="text-space-muted text-sm leading-relaxed mb-5 max-w-3xl">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="mb-5">
        <span className="font-mono text-[10px] tracking-widest uppercase text-space-muted block mb-2">
          Tech Stack
        </span>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs bg-space-accent/5 text-space-accent border border-space-accent/20 rounded px-2.5 py-1"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Mission Impact */}
      <div>
        <span className="font-mono text-[10px] tracking-widest uppercase text-space-muted block mb-1.5">
          ◈ Mission Impact
        </span>
        <p className="text-sm text-space-success leading-relaxed">{project.impact}</p>
      </div>
    </motion.article>
  );
}

function SystemCard({ project, index }: { project: Project; index: number }) {
  const animation = useViewportAnimation({ delay: index * 0.1, direction: 'up' });

  return (
    <motion.article
      ref={animation.ref as React.RefObject<HTMLDivElement>}
      initial={animation.initial}
      animate={animation.animate}
      transition={animation.transition as import('framer-motion').Transition}
      className="relative group bg-space-surface/30 backdrop-blur-sm border border-space-accent/10 rounded-lg p-6 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.08)] hover:border-space-accent/30 transition-all duration-200"
      aria-label={`Project: ${project.name}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] tracking-widest uppercase text-space-muted border border-space-muted/20 rounded px-2 py-0.5">
          System
        </span>
        <span className="font-mono text-[10px] text-space-muted/70 tracking-wide">
          {getCompanyAttribution(project.id)}
        </span>
      </div>

      {/* System Name */}
      <h3 className="text-base font-semibold text-space-text mb-2">{project.name}</h3>

      {/* Brief */}
      <p className="text-space-muted text-sm leading-relaxed mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Tech Tags */}
      <div className="mb-4">
        <span className="font-mono text-[9px] tracking-widest uppercase text-space-muted block mb-1.5">
          Tech Stack
        </span>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[11px] bg-space-accent/5 text-space-accent/80 border border-space-accent/15 rounded px-2 py-0.5"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Impact */}
      <div>
        <span className="font-mono text-[9px] tracking-widest uppercase text-space-muted block mb-1">
          ◈ Mission Impact
        </span>
        <p className="text-xs text-space-success leading-relaxed">{project.impact}</p>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="py-20 px-4 relative z-10"
      aria-label="Projects"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-space-text">
              Mission Assets
            </h2>
            <span className="font-mono text-[9px] tracking-widest uppercase text-space-success bg-space-success/10 border border-space-success/20 rounded px-2 py-0.5">
              Operational
            </span>
          </div>
          <p className="font-mono text-sm text-space-muted tracking-wide">
            Systems developed for satellite operations
          </p>
        </div>

        {/* Featured Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {featuredProjects.map((project, index) => (
            <FeaturedMissionPanel
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* Regular Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regularProjects.map((project, index) => (
            <SystemCard
              key={project.id}
              project={project}
              index={index + featuredProjects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
