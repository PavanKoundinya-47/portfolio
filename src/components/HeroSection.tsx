'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';

// ─── Icon Components ────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="inline-block mr-2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// ─── Telemetry Clock ────────────────────────────────────────────────────────

function TelemetryClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const currentTime = now.toLocaleTimeString('en-IN', {
        hour12: false,
      });

      setTime(`${currentTime} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono tracking-wider text-cyan-400">
      {time}
    </span>
  );
}

// ─── Icon Map ───────────────────────────────────────────────────────────────

const iconMap = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: EmailIcon,
};

// ─── Animation Variants ─────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const panelVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// ─── Main Component ─────────────────────────────────────────────────────────

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const handleExploreMission = () => {
    const section = document.getElementById('mission-brief');
    if (section) {
      section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <section
      className="min-h-screen relative overflow-hidden px-4 py-8 md:py-0"
      aria-label="Hero"
    >
      {/* Profile Image Lightbox */}
      {isImageExpanded && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsImageExpanded(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setIsImageExpanded(false); }}
          role="dialog"
          aria-label="Profile image expanded"
          tabIndex={0}
        >
          <img
            src={`${basePath}/og-image.jpg`}
            alt="Pavan Lanka"
            className="max-w-full max-h-[80vh] rounded-lg border border-space-accent/20 shadow-2xl"
          />
          <span className="absolute top-6 right-6 text-space-muted font-mono text-sm">ESC to close</span>
        </div>
      )}

      {/* Telemetry Corner Readouts - very low opacity atmosphere */}
      <div className="absolute top-4 left-4 font-mono text-[10px] sm:text-xs text-space-muted/15 space-y-1 z-10 select-none" aria-hidden="true">
        <div>MET: <TelemetryClock /></div>
        <div>
          UPLINK: <span className="text-emerald-400 font-semibold">NOMINAL</span>
        </div>
        <div>
          COORD: <span className="text-amber-400 font-semibold">12.9° N, 77.5° E</span>
        </div>
        <div className="text-gray-300/40 pt-1">FREQ: 2.4 GHz</div>
        <div className="text-gray-300/40">SIGNAL: ████████░░</div>
        <div className="text-gray-300/40">TELEMETRY: ACTIVE</div>
      </div>

      {/* Main Grid Layout */}
      <motion.div
        className="min-h-screen flex flex-col justify-center max-w-7xl mx-auto z-10 relative"
        variants={prefersReducedMotion ? undefined : containerVariants}
        initial={prefersReducedMotion ? undefined : 'hidden'}
        animate={prefersReducedMotion ? undefined : 'visible'}
      >
        {/* Right: Mission Status Panel - overlaid on top */}
        <div className="ml-auto w-full max-w-md lg:max-w-lg space-y-4 lg:space-y-5 relative z-10">
          {/* Commander Identifier */}
          <motion.div
            className="bg-space-surface/30 backdrop-blur-sm border border-space-accent/10 rounded-lg p-5 lg:p-6"
            variants={prefersReducedMotion ? undefined : panelVariants}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-mono text-[10px] sm:text-xs text-space-muted/60 uppercase tracking-widest mb-2">
                  Mission Commander
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-space-text mb-2">
                  {profile.name}
                </h1>
                <p className="font-mono text-sm sm:text-base text-space-accent">
                  <span className="text-space-muted/60">MISSION: </span>
                  <span>{profile.title}</span>
                </p>
                <p className="text-sm text-space-muted mt-2 max-w-lg">
                  {profile.tagline}
                </p>
              </div>
              <button
                onClick={() => setIsImageExpanded(true)}
                className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-space-accent/30 hover:border-space-accent/60 hover:scale-105 transition-all duration-300 shadow-lg shadow-space-accent/10"
                aria-label="View profile image"
              >
                <img
                  src={`${basePath}/og-image.jpg`}
                  alt="Pavan Lanka"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </motion.div>

          {/* Status Panel */}
          <motion.div
            className="bg-space-surface/30 backdrop-blur-sm border border-space-accent/10 rounded-lg p-4 lg:p-5"
            variants={prefersReducedMotion ? undefined : panelVariants}
          >
            <div className="font-mono text-[10px] sm:text-xs text-space-muted/60 uppercase tracking-widest mb-3">
              System Status
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs sm:text-sm">
              {/* Status Active */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full bg-space-success ${prefersReducedMotion ? '' : 'animate-[pulse_2s_ease-in-out_infinite]'}`} />
                <span className="text-space-success">STATUS: ACTIVE</span>
              </div>
              {/* Orbit */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-space-accent" />
                <span className="text-space-muted">ORBIT: {profile.currentRole.company}</span>
              </div>
              {/* Mission Phase */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full bg-space-accent-secondary ${prefersReducedMotion ? '' : 'animate-[pulse_3s_ease-in-out_infinite]'}`} />
                <span className="text-space-muted">PHASE: Operations</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            variants={prefersReducedMotion ? undefined : panelVariants}
          >
            <button
              onClick={handleExploreMission}
              className="px-6 py-3 bg-space-surface/40 backdrop-blur-sm border border-space-accent/30 text-space-accent font-mono text-sm font-semibold rounded-lg hover:bg-space-accent/10 hover:border-space-accent/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all duration-300 min-h-[44px] min-w-[44px] uppercase tracking-wider"
            >
              Explore Mission
            </button>
            <a
              href={`${basePath}/resume.pdf`}
              download
              aria-label="Download resume PDF"
              className="px-6 py-3 bg-space-surface/20 backdrop-blur-sm border border-space-muted/20 text-space-muted font-mono text-sm rounded-lg hover:bg-space-surface/40 hover:border-space-muted/40 hover:text-space-text transition-all duration-300 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              <DownloadIcon />
              Download Resume
            </a>
          </motion.div>

          {/* Comm Links (Social) */}
          <motion.div
            className="bg-space-surface/20 backdrop-blur-sm border border-space-accent/10 rounded-lg p-4"
            variants={prefersReducedMotion ? undefined : panelVariants}
          >
            <div className="font-mono text-[10px] sm:text-xs text-space-muted/60 uppercase tracking-widest mb-3">
              Comm Links
            </div>
            <div className="flex gap-4">
              {profile.socialLinks.map((link) => {
                const Icon = iconMap[link.platform];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="text-space-muted hover:text-space-accent transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center border border-space-accent/10 rounded-md hover:border-space-accent/30 hover:bg-space-accent/5"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom telemetry bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] text-space-muted/10 select-none z-10" aria-hidden="true">
        ── GROUND CONTROL · MISSION OPERATIONS CENTER ──
      </div>
    </section>
  );
}
