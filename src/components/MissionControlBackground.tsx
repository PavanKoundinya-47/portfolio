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

// Seeded PRNG for deterministic random values (avoids hydration mismatch)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function generateStars(count: number): DeepSpaceStar[] {
  const rand = seededRandom(42);
  const stars: DeepSpaceStar[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      size: 0.5 + rand() * 1.5,
      baseOpacity: 0.2 + rand() * 0.5,
      twinkleSpeed: 0.3 + rand() * 0.7,
      twinkleOffset: rand() * Math.PI * 2,
    });
  }
  return stars;
}

function generateSatellites(count: number): Satellite[] {
  const rand = seededRandom(123);
  const satellites: Satellite[] = [];
  for (let i = 0; i < count; i++) {
    satellites.push({
      pathIndex: i % 5,
      progress: rand(),
      speed: 0.0003 + rand() * 0.0004, // 20-40s per pass
      size: 2 + rand() * 1.5,
      opacity: 0.3 + rand() * 0.4,
    });
  }
  return satellites;
}

function generateTelemetry(count: number): TelemetryStream[] {
  const rand = seededRandom(456);
  const streams: TelemetryStream[] = [];
  for (let i = 0; i < count; i++) {
    streams.push({
      x: 5 + rand() * 90,
      y: rand() * 100,
      text: TELEMETRY_STRINGS[Math.floor(rand() * TELEMETRY_STRINGS.length)],
      opacity: 0,
      speed: 0.002 + rand() * 0.003,
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

      {/* LAYER 1.5: Sun in top-right corner */}
      <SunLayer reducedMotion={prefersReducedMotion} />

      {/* LAYER 1.55: Distant Planets - drifting slowly, not orbiting Earth */}
      <PlanetsLayer reducedMotion={prefersReducedMotion} />

      {/* LAYER 1.6: Earth with Moon and Orbits - full page canvas */}
      <div className="absolute inset-0 flex items-center" style={{ paddingLeft: 'calc(10% - 5px)', overflow: 'visible' }}>
        <div className="w-[500px] h-[500px] lg:w-[650px] lg:h-[650px]" style={{ overflow: 'visible' }}>
          <EarthVisualization prefersReducedMotion={prefersReducedMotion} />
        </div>
      </div>

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
        background: 'linear-gradient(180deg, #030B1A 0%, #0A1628 40%, #131E35 100%)',
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

// ─── LAYER 1.5: SUN ─────────────────────────────────────────────────────────

function SunLayer({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Sun body gradient */}
          <radialGradient id="sunBodyGradient" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="30%" stopColor="#FCD34D" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>
          {/* Corona glow */}
          <radialGradient id="sunCorona" cx="50%" cy="50%" r="50%">
            <stop offset="35%" stopColor="#FCD34D" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.12" />
            <stop offset="75%" stopColor="#D97706" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>
          <filter id="flareGlow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="prominenceGlow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Sun group positioned at top-right with 5% padding */}
        {/* 5% of 1920 = 96, 5% of 1080 = 54. Sun center at (1920-96-60, 54+60) = (1764, 114) with r=60 */}
        <g>
          {/* Corona / outer glow */}
          <circle cx="1764" cy="114" r="120" fill="url(#sunCorona)" />

          {/* Sun body */}
          <circle cx="1764" cy="114" r="60" fill="url(#sunBodyGradient)" opacity="0.85" />

          {/* Sunspots */}
          <circle cx="1750" cy="106" r="5" fill="#92400E" opacity="0.5" />
          <circle cx="1778" cy="120" r="4" fill="#92400E" opacity="0.4" />
          <circle cx="1758" cy="126" r="3" fill="#78350F" opacity="0.35" />
          <circle cx="1772" cy="102" r="2.5" fill="#92400E" opacity="0.3" />

          {/* Solar prominences with true SVG animate for movement */}

          {/* Prominence 1: large eruption top-right — grows and recedes */}
          <path
            filter="url(#prominenceGlow)"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          >
            {!reducedMotion && (
              <animate
                attributeName="d"
                dur="4s"
                repeatCount="indefinite"
                values="M 1805 85 C 1812 72 1820 68 1818 62 C 1822 70 1818 80 1808 84;
                        M 1805 85 C 1815 65 1828 58 1825 48 C 1832 60 1825 75 1810 82;
                        M 1805 85 C 1812 72 1820 68 1818 62 C 1822 70 1818 80 1808 84"
              />
            )}
            {reducedMotion && (
              <set attributeName="d" to="M 1805 85 C 1812 72 1820 68 1818 62 C 1822 70 1818 80 1808 84" />
            )}
          </path>

          {/* Prominence 2: left arc — sways outward */}
          <path
            filter="url(#prominenceGlow)"
            fill="none"
            stroke="#FCD34D"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          >
            {!reducedMotion && (
              <animate
                attributeName="d"
                dur="5.5s"
                repeatCount="indefinite"
                values="M 1710 100 C 1695 95 1690 85 1692 78 C 1688 90 1692 98 1708 102;
                        M 1710 100 C 1690 92 1682 80 1685 68 C 1680 85 1688 96 1706 101;
                        M 1710 100 C 1695 95 1690 85 1692 78 C 1688 90 1692 98 1708 102"
              />
            )}
            {reducedMotion && (
              <set attributeName="d" to="M 1710 100 C 1695 95 1690 85 1692 78 C 1688 90 1692 98 1708 102" />
            )}
          </path>

          {/* Prominence 3: bottom eruption — pulses upward */}
          <path
            filter="url(#prominenceGlow)"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.55"
          >
            {!reducedMotion && (
              <animate
                attributeName="d"
                dur="3.8s"
                repeatCount="indefinite"
                values="M 1755 172 C 1752 180 1748 185 1750 190 C 1745 183 1747 177 1753 171;
                        M 1755 172 C 1750 185 1745 195 1748 202 C 1742 192 1745 180 1752 173;
                        M 1755 172 C 1752 180 1748 185 1750 190 C 1745 183 1747 177 1753 171"
              />
            )}
            {reducedMotion && (
              <set attributeName="d" to="M 1755 172 C 1752 180 1748 185 1750 190 C 1745 183 1747 177 1753 171" />
            )}
          </path>

          {/* Prominence 4: top-left wispy tendril — dances */}
          <path
            filter="url(#flareGlow)"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          >
            {!reducedMotion && (
              <animate
                attributeName="d"
                dur="6s"
                repeatCount="indefinite"
                values="M 1725 62 C 1718 52 1712 46 1710 50 C 1713 42 1720 48 1724 58;
                        M 1725 62 C 1715 48 1706 38 1704 42 C 1708 34 1718 44 1723 56;
                        M 1725 62 C 1718 52 1712 46 1710 50 C 1713 42 1720 48 1724 58"
              />
            )}
            {reducedMotion && (
              <set attributeName="d" to="M 1725 62 C 1718 52 1712 46 1710 50 C 1713 42 1720 48 1724 58" />
            )}
          </path>

          {/* Prominence 5: right jet — shoots and retreats */}
          <path
            filter="url(#prominenceGlow)"
            fill="none"
            stroke="#FCD34D"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          >
            {!reducedMotion && (
              <animate
                attributeName="d"
                dur="4.5s"
                repeatCount="indefinite"
                values="M 1822 118 C 1832 115 1836 110 1838 113 C 1834 117 1830 119 1821 120;
                        M 1822 118 C 1838 112 1845 106 1848 110 C 1842 115 1835 118 1823 119;
                        M 1822 118 C 1832 115 1836 110 1838 113 C 1834 117 1830 119 1821 120"
              />
            )}
            {reducedMotion && (
              <set attributeName="d" to="M 1822 118 C 1832 115 1836 110 1838 113 C 1834 117 1830 119 1821 120" />
            )}
          </path>

          {/* Prominence 6: bottom-right detached loop — floats */}
          <path
            filter="url(#flareGlow)"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.45"
          >
            {!reducedMotion && (
              <animate
                attributeName="d"
                dur="7s"
                repeatCount="indefinite"
                values="M 1800 160 C 1808 168 1812 172 1808 178 C 1815 170 1810 162 1802 158;
                        M 1800 160 C 1812 172 1818 180 1814 188 C 1820 178 1815 165 1803 160;
                        M 1800 160 C 1808 168 1812 172 1808 178 C 1815 170 1810 162 1802 158"
              />
            )}
            {reducedMotion && (
              <set attributeName="d" to="M 1800 160 C 1808 168 1812 172 1808 178 C 1815 170 1810 162 1802 158" />
            )}
          </path>
        </g>
      </svg>
    </div>
  );
}


// ─── LAYER 1.55: DISTANT PLANETS ────────────────────────────────────────────

function PlanetsLayer({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="marsGradient" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#EF9A6E" />
            <stop offset="60%" stopColor="#C0522A" />
            <stop offset="100%" stopColor="#7C2D12" />
          </radialGradient>
          <radialGradient id="venusGradient" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="60%" stopColor="#D4A24C" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>
          <radialGradient id="jupiterGradient" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#F5D0A9" />
            <stop offset="40%" stopColor="#C4956A" />
            <stop offset="70%" stopColor="#8B5E3C" />
            <stop offset="100%" stopColor="#5C3A1E" />
          </radialGradient>
          <radialGradient id="saturnGradient" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#F5E6C8" />
            <stop offset="50%" stopColor="#C9A96E" />
            <stop offset="100%" stopColor="#8B6914" />
          </radialGradient>
        </defs>

        {/* Mars - small, reddish, bottom-right area */}
        <g opacity="0.7">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 15 -8; 0 0"
            dur={reducedMotion ? '0.001s' : '90s'}
            repeatCount="indefinite"
          />
          <circle cx="1500" cy="750" r="12" fill="url(#marsGradient)" />
          <ellipse cx="1500" cy="740" rx="6" ry="2" fill="#FDE8D0" opacity="0.3" />
        </g>

        {/* Venus - yellowish, top-left area */}
        <g opacity="0.6">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; -10 12; 0 0"
            dur={reducedMotion ? '0.001s' : '120s'}
            repeatCount="indefinite"
          />
          <circle cx="350" cy="200" r="18" fill="url(#venusGradient)" />
          <circle cx="350" cy="200" r="20" fill="none" stroke="#FDE68A" strokeWidth="1" opacity="0.2" />
        </g>

        {/* Jupiter - largest, bottom-left */}
        <g opacity="0.5">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 8 5; 0 0"
            dur={reducedMotion ? '0.001s' : '150s'}
            repeatCount="indefinite"
          />
          <circle cx="200" cy="850" r="35" fill="url(#jupiterGradient)" />
          <ellipse cx="200" cy="840" rx="34" ry="4" fill="#A0754A" opacity="0.3" />
          <ellipse cx="200" cy="852" rx="33" ry="3" fill="#7C5B3A" opacity="0.25" />
          <ellipse cx="200" cy="862" rx="32" ry="3.5" fill="#A0754A" opacity="0.2" />
          <ellipse cx="215" cy="855" rx="6" ry="4" fill="#C0522A" opacity="0.4" />
        </g>

        {/* Saturn - with rings, right side mid-height */}
        <g opacity="0.5">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; -12 -6; 0 0"
            dur={reducedMotion ? '0.001s' : '180s'}
            repeatCount="indefinite"
          />
          <circle cx="1650" cy="400" r="28" fill="url(#saturnGradient)" />
          <ellipse cx="1650" cy="400" rx="50" ry="10" fill="none" stroke="#C9A96E" strokeWidth="3" opacity="0.4" />
          <ellipse cx="1650" cy="400" rx="58" ry="12" fill="none" stroke="#A08040" strokeWidth="2" opacity="0.25" />
          <ellipse cx="1650" cy="400" rx="44" ry="8" fill="none" stroke="#D4B878" strokeWidth="1.5" opacity="0.3" />
        </g>
      </svg>
    </div>
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
      viewBox="-100 -100 700 700"
      className="w-full h-full"
      style={{ overflow: 'visible' }}
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

        {/* Orbit paths */}
        <path
          id="leoOrbitPath"
          d="M 435,250 A 185,75 -20 1,1 65,250 A 185,75 -20 1,1 435,250"
          fill="none"
        />
        <path
          id="geoOrbitPath"
          d="M 475,250 A 225,110 12 1,1 25,250 A 225,110 12 1,1 475,250"
          fill="none"
        />
        <path
          id="polarOrbitPath"
          d="M 420,250 A 170,170 0 1,1 80,250 A 170,170 0 1,1 420,250"
          fill="none"
        />
      </defs>

      {/* Moon */}
      <defs>
        <radialGradient id="moonGradient" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#D1D5DB" />
          <stop offset="50%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#6B7280" />
        </radialGradient>
        <radialGradient id="moonShadow" cx="75%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <g
        className={prefersReducedMotion ? '' : 'animate-[spin_45s_linear_infinite]'}
        style={{ transformOrigin: '250px 250px' }}
      >
        <g transform="translate(595, 250)">
          <circle cx="0" cy="0" r="20" fill="url(#moonGradient)" />
          <circle cx="0" cy="0" r="20" fill="url(#moonShadow)" />
          <circle cx="-5" cy="-6" r="3.5" fill="#4B5563" opacity="0.4" />
          <circle cx="6" cy="3" r="2.5" fill="#4B5563" opacity="0.35" />
          <circle cx="-2" cy="8" r="2" fill="#4B5563" opacity="0.3" />
          <circle cx="3" cy="-9" r="1.5" fill="#4B5563" opacity="0.25" />
        </g>
      </g>

      {/* Atmospheric Glow */}
      <circle cx="250" cy="250" r="210" fill="url(#earthGlow)" />
      <circle
        cx="250" cy="250" r="148"
        fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.2"
        filter="url(#atmosphereBlur)"
        className={prefersReducedMotion ? '' : 'animate-[pulse_5s_ease-in-out_infinite]'}
      />

      {/* Earth Body */}
      <g
        clipPath="url(#earthClip)"
        className={prefersReducedMotion ? '' : 'animate-[spin_240s_linear_infinite]'}
        style={{ transformOrigin: '250px 250px' }}
      >
        <circle cx="250" cy="250" r="140" fill="url(#earthOcean)" />
        <path d="M155 175 C160 160 180 150 200 155 C215 158 225 165 230 175 C235 185 232 195 225 205 C218 215 205 220 195 225 C180 230 165 225 158 215 C150 200 148 185 155 175Z" fill="#1B5E3B" opacity="0.6" />
        <path d="M195 225 C200 228 205 235 208 245 C210 252 207 258 202 255 C198 250 195 240 195 225Z" fill="#1B5E3B" opacity="0.55" />
        <path d="M205 260 C215 255 225 260 230 275 C235 295 230 320 225 335 C220 345 212 350 207 345 C200 335 195 310 198 290 C200 275 200 265 205 260Z" fill="#1F6B45" opacity="0.55" />
        <path d="M260 155 C270 150 285 152 290 160 C295 168 292 175 285 178 C278 180 268 178 262 172 C256 165 255 158 260 155Z" fill="#1A5C38" opacity="0.5" />
        <path d="M265 185 C280 180 300 185 310 200 C318 215 320 240 315 260 C310 280 300 295 285 300 C270 305 258 295 255 280 C250 260 248 230 252 210 C255 195 258 188 265 185Z" fill="#22704A" opacity="0.55" />
        <path d="M295 145 C320 140 350 150 365 170 C375 185 378 205 370 220 C362 235 345 245 325 245 C310 245 295 238 285 225 C275 210 278 190 285 170 C288 158 290 148 295 145Z" fill="#1D6340" opacity="0.5" />
        <path d="M320 230 C328 228 335 235 337 245 C338 258 332 270 325 272 C318 274 315 265 315 255 C315 242 316 232 320 230Z" fill="#1F6B45" opacity="0.5" />
        <path d="M355 295 C370 290 385 295 390 305 C395 315 390 325 380 328 C370 330 358 325 355 315 C352 305 350 298 355 295Z" fill="#1A5C38" opacity="0.45" />
        <ellipse cx="250" cy="118" rx="55" ry="12" fill="#E2E8F0" opacity="0.15" />
        <ellipse cx="250" cy="382" rx="45" ry="10" fill="#E2E8F0" opacity="0.12" />
      </g>

      {/* Day/Night shading */}
      <circle cx="250" cy="250" r="140" fill="url(#dayNight)" />
      <circle cx="250" cy="250" r="141" fill="none" stroke="#93C5FD" strokeWidth="1.5" opacity="0.35" />
      <circle cx="250" cy="250" r="143" fill="none" stroke="#60A5FA" strokeWidth="0.5" opacity="0.15" />

      {/* Orbit Paths */}
      <use href="#leoOrbitPath" stroke="#3B82F6" strokeWidth="1" opacity="0.35" strokeDasharray="6 8" />
      <use href="#geoOrbitPath" stroke="#8B5CF6" strokeWidth="1" opacity="0.3" strokeDasharray="8 10" />
      <use href="#polarOrbitPath" stroke="#10B981" strokeWidth="1" opacity="0.25" strokeDasharray="4 10" />

      {/* Satellites */}
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

      {/* Labels */}
      <text x="400" y="118" fill="#60A5FA" fontSize="10" fontFamily="monospace" opacity="0.7">LEO</text>
      <text x="420" y="88" fill="#C4B5FD" fontSize="10" fontFamily="monospace" opacity="0.7">GEO</text>
      <text x="100" y="88" fill="#6EE7B7" fontSize="10" fontFamily="monospace" opacity="0.7">POLAR</text>
      <text x="15" y="470" fill="#60A5FA" fontSize="8" fontFamily="monospace" opacity="0.4">SAT-001 ACTIVE</text>
      <text x="15" y="482" fill="#C4B5FD" fontSize="8" fontFamily="monospace" opacity="0.4">SAT-002 ACTIVE</text>
      <text x="15" y="494" fill="#6EE7B7" fontSize="8" fontFamily="monospace" opacity="0.4">SAT-003 ACTIVE</text>
    </svg>
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
