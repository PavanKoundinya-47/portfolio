export interface Skill {
  name: string;
  proficiency: number; // 0–100
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export type SkillsData = SkillCategory[];

export const skillsData: SkillsData = [
  {
    category: "Backend Engineering",
    skills: [
      { name: "Python", proficiency: 92 },
      { name: "FastAPI", proficiency: 92 },
      { name: "REST APIs", proficiency: 90 },
      { name: "JWT Authentication", proficiency: 88 },
      { name: "Django", proficiency: 80 },
      { name: "PostgreSQL", proficiency: 85 },
    ],
  },

  {
    category: "Frontend Development",
    skills: [
      { name: "React", proficiency: 85 },
      { name: "JavaScript", proficiency: 88 },
      { name: "TypeScript", proficiency: 75 },
      { name: "Redux", proficiency: 78 },
      { name: "Tailwind CSS", proficiency: 80 },
      { name: "HTML5/CSS3", proficiency: 85 },
    ],
  },

  {
    category: "Cloud & DevOps",
    skills: [
      { name: "AWS", proficiency: 82 },
      { name: "Docker", proficiency: 80 },
      { name: "Linux", proficiency: 88 },
      { name: "Apache", proficiency: 75 },
      { name: "Git", proficiency: 88 },
      { name: "Shell Scripting", proficiency: 85 },
    ],
  },

  {
    category: "Geospatial & Remote Sensing",
    skills: [
      { name: "STAC", proficiency: 90 },
      { name: "GeoTIFF", proficiency: 88 },
      { name: "Cloud Optimized GeoTIFF", proficiency: 85 },
      { name: "GDAL", proficiency: 80 },
      { name: "RasterIO", proficiency: 80 },
      { name: "GeoJSON", proficiency: 90 },
    ],
  },

  {
    category: "Space Systems",
    skills: [
      { name: "Mission Control Systems", proficiency: 90 },
      { name: "Satellite Ground Systems", proficiency: 88 },
      { name: "Imagery Tasking Platforms", proficiency: 90 },
      { name: "Satellite Tracking", proficiency: 85 },
      { name: "Conflict Management Systems", proficiency: 85 },
      { name: "Telemetry Monitoring", proficiency: 80 },
    ],
  },

  {
    category: "Data & Image Processing",
    skills: [
      { name: "NumPy", proficiency: 82 },
      { name: "Pandas", proficiency: 82 },
      { name: "OpenCV", proficiency: 80 },
      { name: "Scikit-learn", proficiency: 70 },
      { name: "Image Processing", proficiency: 85 },
      { name: "Data Automation Pipelines", proficiency: 88 },
    ],
  },
];