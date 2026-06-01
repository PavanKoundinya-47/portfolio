export interface Achievement {
  id: string;
  description: string;
  category: string;
}

export type AchievementsData = Achievement[];

export const achievements: AchievementsData = [
  {
    id: "MSN-001",
    description:
      "Developed a STAC-compliant Data Dissemination Platform enabling standardized discovery and access to multi-source satellite imagery datasets.",
    category: "Geospatial Systems",
  },

  {
    id: "MSN-002",
    description:
      "Built an end-to-end Satellite Imagery Tasking Platform supporting scheduling, processing, delivery, and operational workflows across multiple satellite constellations.",
    category: "Space Operations",
  },

  {
    id: "MSN-003",
    description:
      "Designed and developed a Mission Control application with real-time conflict visualization and scheduling management capabilities.",
    category: "Mission Control",
  },

  {
    id: "MSN-004",
    description:
      "Engineered an automated CVAT pipeline for large-scale geospatial annotation workflows supporting GeoTIFF, COG, and TIFF imagery formats.",
    category: "Automation",
  },

  {
    id: "MSN-005",
    description:
      "Contributed to satellite ground systems including telemetry monitoring, health monitoring, live satellite tracking, and operational tooling.",
    category: "Satellite Systems",
  },

  {
    id: "MSN-006",
    description:
      "Developed scalable backend services using FastAPI and PostgreSQL for mission-critical geospatial and operational platforms.",
    category: "Backend Engineering",
  },

  {
    id: "MSN-007",
    description:
      "Implemented workflow automation using AWS, shell scripting, and scheduled jobs to improve operational efficiency.",
    category: "Cloud & DevOps",
  },

  {
    id: "MSN-008",
    description:
      "Applied remote sensing and image processing techniques including mosaicking, geometric correction, and band registration for satellite imagery workflows.",
    category: "Remote Sensing",
  },
];