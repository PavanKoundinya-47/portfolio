export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  achievements?: string[];
}

export type ExperienceData = ExperienceEntry[];

export const experienceData: ExperienceData = [
  {
    id: "kaleideo",
    company: "Kaleideo Space Systems",
    role: "Software Development Engineer 2",
    startDate: "Oct 2025",
    endDate: null,
    isCurrent: true,
    description:
      "Building geospatial and space-tech software platforms including imagery tasking systems, mission control applications, and STAC-compliant data dissemination platforms. Developing scalable backend services and operational tools supporting multi-constellation satellite operations.",
    achievements: [
      "Developed a STAC-compliant Data Dissemination Platform for standardized discovery and access to Landsat, Sentinel, and Cartosat imagery datasets",
      "Built an end-to-end Imagery Tasking Platform supporting order management, scheduling, processing, and delivery workflows",
      "Designed and developed a Mission Control application with real-time conflict visualization and scheduling capabilities",
      "Engineered a CVAT automation pipeline for large-scale geospatial labeling workflows supporting GeoTIFF, COG, and TIFF formats",
      "Built scalable FastAPI and PostgreSQL backend services for high-performance geospatial operations",
      "Developed operational monitoring and geospatial visualization interfaces for satellite operations",
    ],
  },
  {
    id: "azista",
    company: "Azista Industries Pvt Ltd",
    role: "Software Engineer",
    startDate: "Jan 2023",
    endDate: "Oct 2025",
    isCurrent: false,
    description:
      "Contributed to satellite ground systems, mission control applications, health monitoring platforms, and live satellite tracking solutions. Built cloud-native operational systems supporting spacecraft operations and geospatial workflows.",
    achievements: [
      "Developed mission control, health monitoring, and data dissemination applications for satellite operations",
      "Built secure FastAPI backend services with JWT authentication for mission-critical systems",
      "Implemented real-time satellite tracking and visualization capabilities",
      "Automated operational workflows using shell scripting, cron jobs, and AWS EC2 deployments",
      "Developed telemetry monitoring and operational data visualization interfaces",
      "Applied image processing techniques including mosaicking, geometric correction, and band registration",
    ],
  },
  {
    id: "amazon",
    company: "Amazon",
    role: "Transaction Risk Investigator",
    startDate: "Sep 2021",
    endDate: "Sep 2022",
    isCurrent: false,
    description:
      "Worked on fraud detection and transaction risk analysis by investigating suspicious activities across global marketplaces and supporting fraud prevention initiatives.",
    achievements: [
      "Analyzed customer behavior and transaction patterns for fraud detection",
      "Investigated suspicious marketplace activities to support loss prevention",
      "Collaborated with cross-functional teams to improve risk assessment processes",
    ],
  },
  {
    id: "cognizant",
    company: "Cognizant",
    role: "Process Executive",
    startDate: "Oct 2019",
    endDate: "Jul 2021",
    isCurrent: false,
    description:
      "Supported geospatial mapping operations and geographic data maintenance for Google Maps platforms across multiple countries.",
    achievements: [
      "Managed mapping operations and geospatial data updates across 26 countries",
      "Performed aerial imagery analysis and map validation using Google's ATLAS platform",
      "Modeled road infrastructure updates and validated geographic datasets",
      "Maintained mapping accuracy and consistency across large-scale geospatial datasets",
    ],
  },
];