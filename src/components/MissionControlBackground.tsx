'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ─── TYPES ──────────────────────────────────────────────────────────────────────

interface DeepSpaceStar {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Satellite {
  pathIndex: number;
  progress: number;
  speed: number;
  size: number;
  opacity: number;
}

interface TelemetryStream {
  x: number;
  y: number;
  text: string;
  opacity: number;
  speed: number;
  fadeDirection: 'in' | 'out';
}

// ─── CONSTANTS ──────────────────────────────────────────────────────────────────

const STAR_COUNT = 120;
const SATELLITE_COUNT = 4;
const TELEMETRY_COUNT = 8;
const FRAME_TIME = 1000 / 30; // 30fps cap

const TELEMETRY_STRINGS = [
  'TLM: 0011010011',
  'LAT: 12.934°N',
  'LON: 77.621°E',
  'SIG: ACTIVE',
  'ALT: 408.2 km',
  'VEL: 7.66 km/s',
  'AOS: 00:14:32',
  'LOS: 00:23:18',
  'FREQ: 2.2 GHz',
  'PWR: NOMINAL',
  'TEMP: -12.4°C',
  'ORBIT: 92.68 min',
  'INC: 51.64°',
  'ECC: 0.0001',
];

const PARALLAX_SPEEDS = {
  stars: 0.1,
  orbits: 0.2,
  grid: 0.3,
  telemetry: 0.5,
  earth: 0.15,
};

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────────

function generateStars(count: number): DeepSpaceStar[] {
  const stars: DeepSpaceStar[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 1.5,
      baseOpacity: 0.2 + Math.random() * 0.5,
      twinkleSpeed: 0.3 + Math.random() * 0.7,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }
  return stars;
}

function generateSatellites(count: number): Satellite[] {
  const satellites: Satellite[] = [];
  for (let i = 0; i < count; i++) {
    satellites.push({
      pathIndex: i % 5,
      progress: Math.random(),
      speed: 0.0003 + Math.random() * 0.0004, // 20-40s per pass
      size: 2 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.4,
    });
  }
  return satellites;
}

function generateTelemetry(count: number): TelemetryStream[] {
  const streams: TelemetryStream[] = [];
  for (let i = 0; i < count; i++) {
    streams.push({
      x: 5 + Math.random() * 90,
      y: Math.random() * 100,
      text: TELEMETRY_STRINGS[Math.floor(Math.random() * TELEMETRY_STRINGS.length)],
      opacity: 0,
      speed: 0.002 + Math.random() * 0.003,
      fadeDirection: 'in',
    });
  }
  return streams;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────────

export default function MissionControlBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<DeepSpaceStar[]>([]);
  const satellitesRef = useRef<Satellite[]>([]);
  const telemetryRef = useRef<TelemetryStream[]>([]);
  const animFrameRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const scrollYRef = useRef<number>(0);
  const rafScrollRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  // Initialize data
  useEffect(() => {
    starsRef.current = generateStars(STAR_COUNT);
    satellitesRef.current = generateSatellites(SATELLITE_COUNT);
    telemetryRef.current = generateTelemetry(TELEMETRY_COUNT);
  }, []);

  // Scroll listener with rAF throttle
  const updateScrollPosition = useCallback(() => {
    if (!containerRef.current) return;
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

    scrollYRef.current = scrollY;

    // Update CSS custom properties for parallax
    const container = containerRef.current;
    container.style.setProperty('--scroll-y', `${scrollY}`);
    container.style.setProperty('--scroll-progress', `${scrollProgress}`);
    container.style.setProperty('--parallax-stars', `${scrollY * PARALLAX_SPEEDS.stars}px`);
    container.style.setProperty('--parallax-orbits', `${scrollY * PARALLAX_SPEEDS.orbits}px`);
    container.style.setProperty('--parallax-grid', `${scrollY * PARALLAX_SPEEDS.grid}px`);
    container.style.setProperty('--parallax-telemetry', `${scrollY * PARALLAX_SPEEDS.telemetry}px`);
    container.style.setProperty('--parallax-earth', `${scrollY * PARALLAX_SPEEDS.earth}px`);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafScrollRef.current) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        updateScrollPosition();
        rafScrollRef.current = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollPosition(); // Initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
    };
  }, [updateScrollPosition]);

  // Animation loop for satellites and telemetry
  useEffect(() => {
    if (prefersReducedMotion) return;

    const animate = (time: number) => {
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = time - lastFrameRef.current;
      if (elapsed >= FRAME_TIME) {
        lastFrameRef.current = time - (elapsed % FRAME_TIME);

        // Update satellites
        for (const sat of satellitesRef.current) {
          sat.progress += sat.speed * (elapsed / 16);
          if (sat.progress > 1) sat.progress -= 1;
        }

        // Update telemetry streams
        for (const stream of telemetryRef.current) {
          if (stream.fadeDirection === 'in') {
            stream.opacity += stream.speed * (elapsed / 16);
            if (stream.opacity >= 0.05) {
              stream.fadeDirection = 'out';
            }
          } else {
            stream.opacity -= stream.speed * 0.5 * (elapsed / 16);
            if (stream.opacity <= 0) {
              stream.opacity = 0;
              stream.fadeDirection = 'in';
              stream.x = 5 + Math.random() * 90;
              stream.y = Math.random() * 100;
              stream.text = TELEMETRY_STRINGS[Math.floor(Math.random() * TELEMETRY_STRINGS.length)];
            }
          }
          // Slow drift upward
          stream.y -= 0.005 * (elapsed / 16);
          if (stream.y < -5) {
            stream.y = 105;
          }
        }

        // Force re-render of dynamic elements
        if (containerRef.current) {
          const satElements = containerRef.current.querySelectorAll('[data-satellite]');
          satellitesRef.current.forEach((sat, i) => {
            const el = satElements[i] as HTMLElement | undefined;
            if (el) {
              el.style.offsetDistance = `${sat.progress * 100}%`;
            }
          });

          const telElements = containerRef.current.querySelectorAll('[data-telemetry]');
          telemetryRef.current.forEach((stream, i) => {
            const el = telElements[i] as HTMLElement | undefined;
            if (el) {
              el.style.opacity = `${stream.opacity}`;
              el.style.transform = `translate(${stream.x}vw, ${stream.y}vh)`;
            }
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleVisibility = () => {
      if (!document.hidden) {
        lastFrameRef.current = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      data-testid="mission-control-background"
      style={{
        '--scroll-y': '0',
        '--scroll-progress': '0',
        '--parallax-stars': '0px',
        '--parallax-orbits': '0px',
        '--parallax-grid': '0px',
        '--parallax-telemetry': '0px',
        '--parallax-earth': '0px',
      } as React.CSSProperties}
    >
      {/* LAYER 1: Deep Space Gradient + Stars */}
      <DeepSpaceLayer stars={starsRef.current.length > 0 ? starsRef.current : generateStars(STAR_COUNT)} reducedMotion={prefersReducedMotion} />

      {/* LAYER 2: Orbital Trajectories */}
      <OrbitalTrajectoryLayer reducedMotion={prefersReducedMotion} />

      {/* LAYER 3: Telemetry Grid */}
      <TelemetryGridLayer />

      {/* LAYER 4: Earth Horizon */}
      <EarthHorizonLayer />

      {/* LAYER 5: Satellite Traffic */}
      <SatelliteTrafficLayer satellites={satellitesRef.current.length > 0 ? satellitesRef.current : generateSatellites(SATELLITE_COUNT)} reducedMotion={prefersReducedMotion} />

      {/* LAYER 6: Data Flow */}
      <DataFlowLayer streams={telemetryRef.current.length > 0 ? telemetryRef.current : generateTelemetry(TELEMETRY_COUNT)} reducedMotion={prefersReducedMotion} />
    </div>
  );
}

// ─── LAYER 1: DEEP SPACE ────────────────────────────────────────────────────────

function DeepSpaceLayer({ stars, reducedMotion }: { stars: DeepSpaceStar[]; reducedMotion: boolean }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(180deg, #020617 0%, #0F172A 40%, #1E293B 100%)',
        transform: 'translateY(var(--parallax-stars))',
      }}
    >
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {stars.map((star, i) => (
          <circle
            key={i}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="white"
            opacity={star.baseOpacity}
            className={reducedMotion ? '' : 'animate-twinkle'}
            style={
              reducedMotion
                ? undefined
                : {
                    animationDelay: `${star.twinkleOffset}s`,
                    animationDuration: `${3 + star.twinkleSpeed * 4}s`,
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}

// ─── LAYER 2: ORBITAL TRAJECTORIES ─────────────────────────────────────────────

function OrbitalTrajectoryLayer({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      className="absolute inset-0"
      style={{ transform: 'translateY(var(--parallax-orbits))' }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Circular orbit - LEO */}
        <ellipse
          cx="960"
          cy="540"
          rx="400"
          ry="400"
          fill="none"
          stroke="rgba(59,130,246,0.08)"
          strokeWidth="0.8"
          strokeDasharray="8 4"
          className={reducedMotion ? '' : 'animate-orbit-rotate'}
        />
        {/* Elliptical orbit - MEO */}
        <ellipse
          cx="960"
          cy="540"
          rx="650"
          ry="320"
          fill="none"
          stroke="rgba(59,130,246,0.06)"
          strokeWidth="0.6"
          strokeDasharray="12 6"
          className={reducedMotion ? '' : 'animate-orbit-rotate-slow'}
          style={{ transformOrigin: '960px 540px' }}
        />
        {/* Elliptical orbit - GEO */}
        <ellipse
          cx="960"
          cy="540"
          rx="850"
          ry="200"
          fill="none"
          stroke="rgba(59,130,246,0.05)"
          strokeWidth="0.5"
          strokeDasharray="16 8"
          className={reducedMotion ? '' : 'animate-orbit-rotate-reverse'}
          style={{ transformOrigin: '960px 540px' }}
        />
        {/* Transfer trajectory - Hohmann */}
        <path
          d="M 560 540 Q 960 200 1360 540"
          fill="none"
          stroke="rgba(59,130,246,0.07)"
          strokeWidth="0.6"
          strokeDasharray="4 8"
          className={reducedMotion ? '' : 'animate-dash-flow'}
        />
        {/* Transfer trajectory - inclined */}
        <path
          d="M 300 700 Q 960 100 1620 700"
          fill="none"
          stroke="rgba(59,130,246,0.05)"
          strokeWidth="0.5"
          strokeDasharray="6 10"
          className={reducedMotion ? '' : 'animate-dash-flow-slow'}
        />
        {/* Polar orbit */}
        <ellipse
          cx="960"
          cy="540"
          rx="180"
          ry="500"
          fill="none"
          stroke="rgba(59,130,246,0.06)"
          strokeWidth="0.5"
          strokeDasharray="4 6"
          className={reducedMotion ? '' : 'animate-orbit-rotate-polar'}
          style={{ transformOrigin: '960px 540px' }}
        />
      </svg>
    </div>
  );
}

// ─── LAYER 3: TELEMETRY GRID ────────────────────────────────────────────────────

function TelemetryGridLayer() {
  const gridLines = [];
  // Horizontal lines
  for (let i = 0; i <= 20; i++) {
    gridLines.push(
      <line
        key={`h-${i}`}
        x1="0"
        y1={`${i * 5}%`}
        x2="100%"
        y2={`${i * 5}%`}
        stroke="rgba(59,130,246,0.03)"
        strokeWidth="0.5"
      />
    );
  }
  // Vertical lines
  for (let i = 0; i <= 20; i++) {
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={`${i * 5}%`}
        y1="0"
        x2={`${i * 5}%`}
        y2="100%"
        stroke="rgba(59,130,246,0.03)"
        strokeWidth="0.5"
      />
    );
  }

  // Coordinate markers at intersections (sparse)
  const markers = [];
  for (let row = 1; row <= 4; row++) {
    for (let col = 1; col <= 4; col++) {
      markers.push(
        <text
          key={`m-${row}-${col}`}
          x={`${col * 20}%`}
          y={`${row * 20}%`}
          fill="rgba(59,130,246,0.04)"
          fontSize="8"
          fontFamily="monospace"
        >
          {`${(col * 20).toString().padStart(3, '0')}.${(row * 20).toString().padStart(3, '0')}`}
        </text>
      );
    }
  }

  return (
    <div
      className="absolute inset-0"
      style={{ transform: 'translateY(var(--parallax-grid))' }}
    >
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {gridLines}
        {markers}
      </svg>
    </div>
  );
}

// ─── LAYER 4: EARTH HORIZON ─────────────────────────────────────────────────────

function EarthHorizonLayer() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[60vh] opacity-60"
      style={{
        transform: 'translateY(var(--parallax-earth))',
        maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
      }}
    >
      <svg
        className="absolute bottom-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 600"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          {/* Atmospheric glow gradient */}
          <radialGradient id="earth-atmosphere" cx="50%" cy="100%" rx="60%" ry="40%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.08)" />
            <stop offset="40%" stopColor="rgba(59,130,246,0.04)" />
            <stop offset="70%" stopColor="rgba(14,165,233,0.02)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* Earth surface gradient */}
          <linearGradient id="earth-surface" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.12)" />
            <stop offset="30%" stopColor="rgba(30,64,175,0.08)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0.95)" />
          </linearGradient>
          {/* Edge lighting */}
          <linearGradient id="earth-edge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(147,197,253,0.3)" />
            <stop offset="10%" stopColor="rgba(59,130,246,0.15)" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Atmospheric glow */}
        <ellipse cx="960" cy="700" rx="1200" ry="300" fill="url(#earth-atmosphere)" />

        {/* Earth curve */}
        <path
          d="M -100 600 Q 960 380 2020 600 L 2020 700 L -100 700 Z"
          fill="url(#earth-surface)"
        />

        {/* Edge lighting on the horizon curve */}
        <path
          d="M -100 600 Q 960 380 2020 600"
          fill="none"
          stroke="url(#earth-edge)"
          strokeWidth="2"
        />

        {/* Subtle secondary atmospheric band */}
        <path
          d="M 200 580 Q 960 420 1720 580"
          fill="none"
          stroke="rgba(147,197,253,0.06)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

// ─── LAYER 5: SATELLITE TRAFFIC ─────────────────────────────────────────────────

function SatelliteTrafficLayer({ satellites, reducedMotion }: { satellites: Satellite[]; reducedMotion: boolean }) {
  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Orbital paths for satellites to follow */}
          <path id="sat-path-0" d="M -50 300 Q 960 100 1970 300" />
          <path id="sat-path-1" d="M -50 500 Q 960 250 1970 500" />
          <path id="sat-path-2" d="M -50 700 Q 960 450 1970 700" />
          <path id="sat-path-3" d="M 200 -50 Q 960 540 1720 1130" />
          <path id="sat-path-4" d="M 1800 -50 Q 960 400 120 1130" />
        </defs>

        {satellites.map((sat, i) => (
          <g key={i} data-satellite>
            {/* Satellite body */}
            <circle r={sat.size} fill="rgba(148,163,184,0.6)" opacity={sat.opacity}>
              <animateMotion
                dur={`${25 + i * 5}s`}
                repeatCount="indefinite"
                begin={`${sat.progress * (25 + i * 5)}s`}
              >
                <mpath href={`#sat-path-${sat.pathIndex}`} />
              </animateMotion>
            </circle>
            {/* Satellite trail */}
            <circle r={sat.size * 0.5} fill="rgba(59,130,246,0.3)" opacity={sat.opacity * 0.5}>
              <animateMotion
                dur={`${25 + i * 5}s`}
                repeatCount="indefinite"
                begin={`${sat.progress * (25 + i * 5) + 0.3}s`}
              >
                <mpath href={`#sat-path-${sat.pathIndex}`} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── LAYER 6: DATA FLOW ─────────────────────────────────────────────────────────

function DataFlowLayer({ streams, reducedMotion }: { streams: TelemetryStream[]; reducedMotion: boolean }) {
  if (reducedMotion) return null;

  return (
    <div
      className="absolute inset-0"
      style={{ transform: 'translateY(var(--parallax-telemetry))' }}
    >
      {streams.map((stream, i) => (
        <span
          key={i}
          data-telemetry
          className="absolute font-mono text-[9px] text-blue-400/[0.04] whitespace-nowrap select-none transition-opacity duration-[3000ms]"
          style={{
            transform: `translate(${stream.x}vw, ${stream.y}vh)`,
            opacity: stream.opacity,
          }}
        >
          {stream.text}
        </span>
      ))}
    </div>
  );
}
