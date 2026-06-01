'use client';

import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { useViewportAnimation } from '../hooks/useViewportAnimation';

function ExpertiseCard({ title, description, index }: { title: string; description: string; index: number }) {
  const animation = useViewportAnimation({ delay: index * 0.1, direction: 'up' });

  return (
    <motion.div
      ref={animation.ref as React.RefObject<HTMLDivElement>}
      initial={animation.initial}
      animate={animation.animate}
      transition={animation.transition as import('framer-motion').Transition}
      className="bg-space-surface border border-space-accent/20 rounded-lg p-6 hover:border-space-accent/50 transition-colors duration-200"
    >
      <h3 className="text-lg font-semibold text-space-text mb-2">{title}</h3>
      <p className="text-space-muted text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default function MissionBriefSection() {
  return (
    <section
      id="mission-brief"
      className="py-20 px-4 relative z-10"
      aria-label="Mission Brief"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-space-text text-center mb-12">
          Mission Brief
        </h2>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Years of experience */}
          <div className="bg-space-surface border border-space-accent/20 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-space-accent mb-1">
              {profile.yearsOfExperience}+
            </p>
            <p className="text-space-muted text-sm">Years of Experience</p>
          </div>

          {/* Current role */}
          <div className="bg-space-surface border border-space-accent/20 rounded-lg p-6 text-center">
            <p className="text-lg font-semibold text-space-text mb-1">
              {profile.currentRole.title}
            </p>
            <p className="text-space-muted text-sm">at {profile.currentRole.company}</p>
          </div>

          {/* Domain expertise */}
          <div className="bg-space-surface border border-space-accent/20 rounded-lg p-6 sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold text-space-text mb-2">Domain Expertise</p>
            <ul className="flex flex-wrap gap-2">
              {profile.domainExpertise.map((domain) => (
                <li
                  key={domain}
                  className="text-xs bg-space-accent/10 text-space-accent border border-space-accent/30 rounded-full px-3 py-1"
                >
                  {domain}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Expertise cards - 2×2 grid on desktop, single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.expertiseCards.map((card, index) => (
            <ExpertiseCard
              key={card.title}
              title={card.title}
              description={card.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
