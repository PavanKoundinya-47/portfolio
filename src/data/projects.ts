export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  impact: string;
  featured: boolean;
  githubUrl?: string;
  demoUrl?: string;
}

export type ProjectsData = Project[];

export const projects: ProjectsData = [
  {
    id: "azista-data-dissemination",
    name: "Customer Data Dissemination Platform",
    description:
      "Built from scratch at Azista Industries. A platform for disseminating customer data including satellite imagery and data products to end customers. Handles secure data delivery, access management, and automated distribution workflows.",
    technologies: ["Python", "Django", "React", "TypeScript", "PostgreSQL", "AWS S3", "Docker", "Redis"],
    impact: "Enabled reliable and secure delivery of satellite data products to customers with automated distribution pipelines",
    featured: true,
  },
  {
    id: "azista-image-tasking",
    name: "Image Tasking Platform",
    description:
      "A mission assistance tool developed at Azista Industries for scheduling and managing satellite image capture requests. Supports task prioritization, conflict resolution, and integration with satellite mission planning systems.",
    technologies: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Celery", "Redis", "Docker"],
    impact: "Streamlined satellite image capture scheduling with automated conflict detection and task prioritization",
    featured: false,
  },
  {
    id: "azista-health-monitoring",
    name: "Satellite Health Monitoring Tool",
    description:
      "A mission assistance tool developed at Azista Industries for monitoring satellite health and telemetry data in real-time. Provides dashboards for subsystem status, anomaly detection, and historical trend analysis.",
    technologies: ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
    impact: "Provided real-time visibility into satellite subsystem health with automated anomaly detection and alerting",
    featured: false,
  },
  {
    id: "kaleideo-data-dissemination",
    name: "Customer Data Dissemination Platform",
    description:
      "Contributed to the customer data dissemination platform at Kaleideo Space Systems for delivering satellite data products to customers. Enhanced data delivery workflows, improved system reliability, and added new distribution capabilities.",
    technologies: ["Python", "Django", "React", "TypeScript", "AWS", "PostgreSQL", "Docker", "Kubernetes"],
    impact: "Improved platform reliability and expanded data delivery capabilities for satellite data products",
    featured: false,
  },
  {
    id: "kaleideo-mission-tasking",
    name: "Mission Tasking Dashboard",
    description:
      "A complete mission tasking dashboard developed at Kaleideo Space Systems for managing satellite mission operations. Provides end-to-end visibility into mission planning, execution, and status tracking.",
    technologies: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS"],
    impact: "Centralized mission operations management with real-time status tracking and streamlined task workflows",
    featured: true,
  },
  {
    id: "kaleideo-image-tasking",
    name: "Image Tasking Application",
    description:
      "An application developed at Kaleideo Space Systems for managing satellite image tasking and scheduling. Supports capture request management, scheduling optimization, and integration with mission planning systems.",
    technologies: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    impact: "Simplified image tasking workflows with efficient scheduling and request management capabilities",
    featured: false,
  },
];
