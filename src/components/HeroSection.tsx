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

// ─── Earth Visualization ────────────────────────────────────────────────────

function EarthVisualization({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean;
}) {
  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        {/* Atmospheric glow */}
        <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#3B82F6" stopOpacity="0.2" />
          <stop offset="80%" stopColor="#3B82F6" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>

        {/* Earth ocean gradient */}
        <radialGradient id="earthOcean" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="40%" stopColor="#1E3A5F" />
          <stop offset="100%" stopColor="#0C1929" />
        </radialGradient>

        {/* Day/night shading overlay */}
        <linearGradient id="dayNight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
        </linearGradient>

        {/* Atmosphere blur */}
        <filter id="atmosphereBlur">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        {/* Clip for Earth contents */}
        <clipPath id="earthClip">
          <circle cx="250" cy="250" r="140" />
        </clipPath>

        {/* Orbit paths as reusable paths */}
        <path
          id="leoOrbitPath"
          d="M 65,250 A 185,75 -20 1,1 65,250.01"
          transform="rotate(-20 250 250)"
          fill="none"
        />
        <path
          id="geoOrbitPath"
          d="M 25,250 A 225,110 12 1,1 25,250.01"
          transform="rotate(12 250 250)"
          fill="none"
        />
        <path
          id="polarOrbitPath"
          d="M 80,250 A 170,170 75 1,1 80,250.01"
          transform="rotate(75 250 250)"
          fill="none"
        />
      </defs>

      {/* Outer Atmospheric Glow */}
      <circle cx="250" cy="250" r="210" fill="url(#earthGlow)" />

      {/* Pulsing atmosphere ring */}
      <circle
        cx="250"
        cy="250"
        r="148"
        fill="none"
        stroke="#60A5FA"
        strokeWidth="2"
        opacity="0.2"
        filter="url(#atmosphereBlur)"
        className={prefersReducedMotion ? '' : 'animate-[pulse_5s_ease-in-out_infinite]'}
      />

      {/* ═══ EARTH BODY ═══ */}
      <g
        clipPath="url(#earthClip)"
        className={prefersReducedMotion ? '' : 'animate-[spin_240s_linear_infinite]'}
        style={{ transformOrigin: '250px 250px' }}
      >
        {/* Ocean base */}
        <circle cx="250" cy="250" r="140" fill="url(#earthOcean)" />

        {/* ── Continents (simplified but recognizable) ── */}

        {/* North America */}
        <path
          d="M155 175 C160 160 180 150 200 155 C215 158 225 165 230 175
             C235 185 232 195 225 205 C218 215 205 220 195 225
             C180 230 165 225 158 215 C150 200 148 185 155 175Z"
          fill="#1B5E3B"
          opacity="0.6"
        />
        {/* Central America */}
        <path
          d="M195 225 C200 228 205 235 208 245 C210 252 207 258 202 255
             C198 250 195 240 195 225Z"
          fill="#1B5E3B"
          opacity="0.55"
        />

        {/* South America */}
        <path
          d="M205 260 C215 255 225 260 230 275 C235 295 230 320 225 335
             C220 345 212 350 207 345 C200 335 195 310 198 290
             C200 275 200 265 205 260Z"
          fill="#1F6B45"
          opacity="0.55"
        />

        {/* Europe */}
        <path
          d="M260 155 C270 150 285 152 290 160 C295 168 292 175 285 178
             C278 180 268 178 262 172 C256 165 255 158 260 155Z"
          fill="#1A5C38"
          opacity="0.5"
        />

        {/* Africa */}
        <path
          d="M265 185 C280 180 300 185 310 200 C318 215 320 240 315 260
             C310 280 300 295 285 300 C270 305 258 295 255 280
             C250 260 248 230 252 210 C255 195 258 188 265 185Z"
          fill="#22704A"
          opacity="0.55"
        />

        {/* Asia (large mass) */}
        <path
          d="M295 145 C320 140 350 150 365 170 C375 185 378 205 370 220
             C362 235 345 245 325 245 C310 245 295 238 285 225
             C275 210 278 190 285 170 C288 158 290 148 295 145Z"
          fill="#1D6340"
          opacity="0.5"
        />

        {/* India */}
        <path
          d="M320 230 C328 228 335 235 337 245 C338 258 332 270 325 272
             C318 274 315 265 315 255 C315 242 316 232 320 230Z"
          fill="#1F6B45"
          opacity="0.5"
        />

        {/* Australia */}
        <path
          d="M355 295 C370 290 385 295 390 305 C395 315 390 325 380 328
             C370 330 358 325 355 315 C352 305 350 298 355 295Z"
          fill="#1A5C38"
          opacity="0.45"
        />

        {/* Ice caps - North */}
        <ellipse cx="250" cy="118" rx="55" ry="12" fill="#E2E8F0" opacity="0.15" />
        {/* Ice caps - South */}
        <ellipse cx="250" cy="382" rx="45" ry="10" fill="#E2E8F0" opacity="0.12" />
      </g>

      {/* Day/Night shading */}
      <circle cx="250" cy="250" r="140" fill="url(#dayNight)" />

      {/* Atmosphere edge highlight */}
      <circle cx="250" cy="250" r="141" fill="none" stroke="#93C5FD" strokeWidth="1.5" opacity="0.35" />
      <circle cx="250" cy="250" r="143" fill="none" stroke="#60A5FA" strokeWidth="0.5" opacity="0.15" />

      {/* ═══ ORBIT PATHS (fixed, not rotating) ═══ */}

      {/* LEO Orbit Path */}
      <use href="#leoOrbitPath" stroke="#3B82F6" strokeWidth="1" opacity="0.35" strokeDasharray="6 8" />

      {/* GEO Orbit Path */}
      <use href="#geoOrbitPath" stroke="#8B5CF6" strokeWidth="1" opacity="0.3" strokeDasharray="8 10" />

      {/* Polar Orbit Path */}
      <use href="#polarOrbitPath" stroke="#10B981" strokeWidth="1" opacity="0.25" strokeDasharray="4 10" />

      {/* ═══ SATELLITES WITH animateMotion ═══ */}

      {/* SAT-001: Earth Observation (Blue, LEO) */}
      {prefersReducedMotion ? (
        <g transform="translate(400, 200)">
          <rect x="-5" y="-3" width="10" height="6" rx="1" fill="#3B82F6" />
          <rect x="-12" y="-1.5" width="5" height="3" fill="#60A5FA" opacity="0.8" />
          <rect x="7" y="-1.5" width="5" height="3" fill="#60A5FA" opacity="0.8" />
        </g>
      ) : (
        <g>
          <animateMotion dur="28s" repeatCount="indefinite" rotate="auto">
            <mpath href="#leoOrbitPath" />
          </animateMotion>
          <rect x="-5" y="-3" width="10" height="6" rx="1" fill="#3B82F6" />
          <rect x="-12" y="-1.5" width="5" height="3" fill="#60A5FA" opacity="0.8" />
          <rect x="7" y="-1.5" width="5" height="3" fill="#60A5FA" opacity="0.8" />
        </g>
      )}

      {/* SAT-002: Communications (Purple, GEO) */}
      {prefersReducedMotion ? (
        <g transform="translate(450, 180)">
          <circle r="4" fill="#8B5CF6" />
          <rect x="-10" y="-1" width="20" height="2" fill="#C4B5FD" opacity="0.7" />
          <rect x="-1" y="-8" width="2" height="5" fill="#C4B5FD" opacity="0.5" />
        </g>
      ) : (
        <g>
          <animateMotion dur="40s" repeatCount="indefinite" rotate="auto" begin="-15s">
            <mpath href="#geoOrbitPath" />
          </animateMotion>
          <circle r="4" fill="#8B5CF6" />
          <rect x="-10" y="-1" width="20" height="2" fill="#C4B5FD" opacity="0.7" />
          <rect x="-1" y="-8" width="2" height="5" fill="#C4B5FD" opacity="0.5" />
        </g>
      )}

      {/* SAT-003: Mission Operations (Green, Polar) */}
      {prefersReducedMotion ? (
        <g transform="translate(250, 85)">
          <polygon points="-5,-4 7,0 -5,4" fill="#10B981" />
          <rect x="-9" y="-1" width="4" height="2" fill="#6EE7B7" opacity="0.7" />
          <rect x="7" y="-1" width="4" height="2" fill="#6EE7B7" opacity="0.7" />
        </g>
      ) : (
        <g>
          <animateMotion dur="35s" repeatCount="indefinite" rotate="auto" begin="-8s">
            <mpath href="#polarOrbitPath" />
          </animateMotion>
          <polygon points="-5,-4 7,0 -5,4" fill="#10B981" />
          <rect x="-9" y="-1" width="4" height="2" fill="#6EE7B7" opacity="0.7" />
          <rect x="7" y="-1" width="4" height="2" fill="#6EE7B7" opacity="0.7" />
        </g>
      )}

      {/* ═══ ORBIT LABELS ═══ */}
      <text x="400" y="118" fill="#60A5FA" fontSize="10" fontFamily="monospace" opacity="0.7">LEO</text>
      <text x="420" y="88" fill="#C4B5FD" fontSize="10" fontFamily="monospace" opacity="0.7">GEO</text>
      <text x="100" y="88" fill="#6EE7B7" fontSize="10" fontFamily="monospace" opacity="0.7">POLAR</text>

      {/* ═══ TELEMETRY LABELS ═══ */}
      <text x="15" y="470" fill="#60A5FA" fontSize="8" fontFamily="monospace" opacity="0.4">SAT-001 ACTIVE</text>
      <text x="15" y="482" fill="#C4B5FD" fontSize="8" fontFamily="monospace" opacity="0.4">SAT-002 ACTIVE</text>
      <text x="15" y="494" fill="#6EE7B7" fontSize="8" fontFamily="monospace" opacity="0.4">SAT-003 ACTIVE</text>
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

const earthVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.0,
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
      </div>
      <div className="absolute top-4 right-4 font-mono text-[10px] sm:text-xs text-space-muted/15 text-right space-y-1 z-10 select-none" aria-hidden="true">
        <div>FREQ: 2.4 GHz</div>
        <div>SIGNAL: ████████░░</div>
        <div>TELEMETRY: ACTIVE</div>
      </div>

      {/* Main Grid Layout */}
      <motion.div
        className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-8 items-center max-w-7xl mx-auto z-10 relative"
        variants={prefersReducedMotion ? undefined : containerVariants}
        initial={prefersReducedMotion ? undefined : 'hidden'}
        animate={prefersReducedMotion ? undefined : 'visible'}
      >
        {/* Left: Earth Visualization */}
        <motion.div
          className="relative w-full max-w-[400px] lg:max-w-[500px] mx-auto aspect-square"
          variants={prefersReducedMotion ? undefined : earthVariants}
        >
          <div className={prefersReducedMotion ? '' : 'animate-float'}>
            <EarthVisualization prefersReducedMotion={prefersReducedMotion} />
          </div>
        </motion.div>

        {/* Right: Mission Status Panel */}
        <div className="space-y-4 lg:space-y-5">
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
