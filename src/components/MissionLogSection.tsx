'use client';

import { motion } from 'framer-motion';
import { achievements } from '../data/achievements';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function MissionLogSection() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number] },
        },
      };

  if (achievements.length === 0) {
    return (
      <section
        id="mission-log"
        className="py-20 px-4 relative z-10"
        aria-label="Mission Log"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-space-text text-center mb-12">
            Mission Log
          </h2>
          <div className="bg-space-surface border border-space-accent/20 rounded-lg p-8 font-mono text-center">
            <p className="text-space-muted">No mission records available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="mission-log"
      className="py-20 px-4 relative z-10"
      aria-label="Mission Log"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-space-text text-center mb-12">
          Mission Log
        </h2>

        {/* Terminal header */}
        <div className="bg-space-surface border border-space-accent/20 rounded-t-lg px-4 py-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/70" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" aria-hidden="true" />
          <span className="ml-4 text-space-muted text-xs font-mono">
            mission-log.terminal
          </span>
        </div>

        {/* Terminal body */}
        <motion.div
          className="bg-space-surface/80 border border-t-0 border-space-accent/20 rounded-b-lg p-6 font-mono"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              variants={itemVariants}
              className="border border-space-accent/10 rounded-md p-4 mb-4 last:mb-0 hover:border-space-accent/30 transition-colors duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <span className="text-space-accent font-bold text-sm">
                  {'>'} {achievement.id}
                </span>
                <span className="text-space-muted text-xs bg-space-surface border border-space-muted/30 rounded-full px-3 py-0.5 w-fit">
                  {achievement.category}
                </span>
              </div>
              <p className="text-space-text text-sm leading-relaxed pl-4">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
