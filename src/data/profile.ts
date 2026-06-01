export interface ExpertiseCard {
  title: string;
  description: string;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'email';
  url: string;
  label: string; // accessible label
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  summary: string; // ≤300 characters
  yearsOfExperience: number;
  currentRole: {
    title: string;
    company: string;
  };
  domainExpertise: string[];
  expertiseCards: ExpertiseCard[];
  socialLinks: SocialLink[];
}

export const profile: Profile = {
  name: 'Pavan Lanka',
  title: 'Software Development Engineer',
  tagline:
    'Building scalable software systems on Earth while contributing to space technology.',
  summary:
    'Software Development Engineer with expertise in backend systems, distributed architectures, and cloud technologies. Passionate about building reliable, high-performance services and contributing to space technology initiatives.',
  yearsOfExperience: 6,
  currentRole: {
    title: 'SDE-2',
    company: 'Kaleideo Space Systems',
  },
domainExpertise: [
  'Space Systems',
  'Mission Operations',
  'Satellite Ground Systems',
  'Geospatial Platforms',
  'Imagery Tasking Systems',
  'Data Dissemination Platforms',
  'Remote Sensing',
  'Backend Engineering',
],

expertiseCards: [
  {
    title: 'Mission Control Systems',
    description:
      'Designing and developing mission control applications, conflict management tools, operational dashboards, and real-time monitoring systems for spacecraft and constellation operations.',
  },
  {
    title: 'Geospatial Platforms',
    description:
      'Building STAC-compliant geospatial platforms, imagery dissemination systems, Earth observation workflows, and large-scale geospatial data processing applications.',
  },
  {
    title: 'Satellite Operations',
    description:
      'Developing software supporting imagery tasking, satellite tracking, health monitoring, scheduling workflows, and operational tooling for multi-constellation missions.',
  },
  {
    title: 'Backend Engineering',
    description:
      'Building scalable backend services using FastAPI, PostgreSQL, REST APIs, and cloud-native architectures for mission-critical applications.',
  },
],
  socialLinks: [
    {
      platform: 'github',
      url: 'https://github.com/PavanKoundinya-47',
      label: 'Visit GitHub profile',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/pavanlanka-profile',
      label: 'Visit LinkedIn profile',
    },
    {
      platform: 'email',
      url: 'mailto:pavanlanka98@gmail.com',
      label: 'Send an email',
    },
  ],
};
