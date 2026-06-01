# Implementation Plan: Portfolio Website

## Overview

Build a modern, space-themed personal portfolio website for Pavan Koundinya using Next.js 15+ with static export, TypeScript, Tailwind CSS, and Framer Motion. The implementation follows an incremental approach: project scaffolding → data layer → core components → animations → form logic → deployment pipeline.

## Tasks

- [x] 1. Set up project structure and configuration
  - [x] 1.1 Initialize Next.js 15+ project with TypeScript, Tailwind CSS, and Framer Motion
    - Run `npx create-next-app@latest` with TypeScript and Tailwind CSS enabled
    - Install dependencies: `framer-motion`, `@testing-library/react`, `@testing-library/jest-dom`, `vitest`, `jsdom`, `fast-check`, `@vitejs/plugin-react`
    - Configure `next.config.mjs` with `output: 'export'`, `images: { unoptimized: true }`, and `basePath`/`assetPrefix` from environment variable
    - Configure `tsconfig.json` with strict mode enabled
    - Create directory structure: `src/app/`, `src/components/`, `src/data/`, `src/hooks/`, `src/test/`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 1.2 Configure Tailwind CSS theme with Mission Control design system
    - Update `tailwind.config.ts` with custom colors: space-bg (#020617), space-surface (#0F172A), space-accent (#3B82F6), space-accent-secondary (#8B5CF6), space-text (#E2E8F0), space-muted (#94A3B8), space-success (#10B981)
    - Add custom font families: Inter (sans), JetBrains Mono (mono)
    - Add custom keyframes and animations: float, twinkle
    - Configure content paths for `src/**/*.{ts,tsx}`
    - _Requirements: 3.1, 3.2, 3.5_

  - [x] 1.3 Set up Vitest testing configuration
    - Create `vitest.config.ts` with jsdom environment, React plugin, and setup file
    - Create `src/test/setup.ts` with `@testing-library/jest-dom` imports
    - Add test scripts to `package.json`
    - _Requirements: 1.2_

  - [x] 1.4 Create root layout and global styles
    - Create `src/app/layout.tsx` with metadata (title, description, Open Graph, Twitter Card, JSON-LD structured data)
    - Create `src/app/globals.css` with Tailwind directives and base dark-mode styles
    - Import Inter and JetBrains Mono fonts
    - Set `<html>` with dark background and text colors
    - _Requirements: 3.1, 3.5, 18.1, 18.2, 18.3, 18.4_

- [x] 2. Implement content data layer
  - [x] 2.1 Create profile data file
    - Create `src/data/profile.ts` with Profile, ExpertiseCard, and SocialLink interfaces
    - Populate with Pavan Koundinya's profile data: name, title, tagline, summary (≤300 chars), yearsOfExperience, currentRole, domainExpertise, expertiseCards (4 cards), socialLinks
    - _Requirements: 19.1, 7.1, 7.2, 7.3, 7.4_

  - [x] 2.2 Create experience data file
    - Create `src/data/experience.ts` with ExperienceEntry interface and ExperienceData type
    - Populate with work history entries in reverse chronological order, including current role at Kalideo marked with `isCurrent: true`
    - _Requirements: 19.2, 8.1, 8.2, 8.3_

  - [x] 2.3 Create projects data file
    - Create `src/data/projects.ts` with Project interface and ProjectsData type
    - Populate with project entries including featured flags, technologies, impact statements, and optional URLs
    - _Requirements: 19.3, 9.2, 9.3, 9.4, 9.5_

  - [x] 2.4 Create skills data file
    - Create `src/data/skills.ts` with Skill, SkillCategory interfaces and SkillsData type
    - Populate with categories: Backend Systems, Cloud & Infrastructure, Databases, Frontend, Soft Skills, each with proficiency values 0-100
    - _Requirements: 19.4, 10.1, 10.2_

  - [x] 2.5 Create achievements data file
    - Create `src/data/achievements.ts` with Achievement interface and AchievementsData type
    - Populate with mission records including id (e.g., "MSN-001"), description, and category
    - _Requirements: 19.5, 11.1, 11.2_

- [x] 3. Implement custom hooks
  - [x] 3.1 Create useReducedMotion hook
    - Create `src/hooks/useReducedMotion.ts`
    - Implement using `window.matchMedia('(prefers-reduced-motion: reduce)')` with event listener for changes
    - Return reactive boolean indicating reduced motion preference
    - _Requirements: 16.7, 20.6_

  - [x] 3.2 Create useScrollSpy hook
    - Create `src/hooks/useScrollSpy.ts`
    - Implement using Intersection Observer to monitor section visibility
    - Return the ID of the currently active section for navigation highlighting
    - _Requirements: 5.8_

  - [x] 3.3 Create useViewportAnimation hook
    - Create `src/hooks/useViewportAnimation.ts`
    - Return Framer Motion animation props (initial, animate, transition) that respect reduced motion
    - Support configurable delay, duration (300-500ms), and direction (up, left, right)
    - Trigger when element is at least 20% visible in viewport
    - _Requirements: 20.1, 20.6_

  - [x] 3.4 Write property test for scroll spy (Property 2)
    - **Property 2: Scroll spy identifies active section**
    - Generate random section positions and scroll offsets, verify correct section ID returned
    - **Validates: Requirements 5.8**

- [x] 4. Implement Starfield background component
  - [x] 4.1 Create Starfield canvas component
    - Create `src/components/Starfield.tsx` as a client component
    - Implement HTML5 Canvas with requestAnimationFrame loop
    - Generate stars across 2 depth layers (far: slow parallax, small; near: faster parallax, larger)
    - Accept `starCount` prop (default 150, range 50-200)
    - Render at device pixel ratio, throttle to 30fps minimum
    - Pause animation when tab is hidden via `document.hidden`
    - Position as `fixed inset-0 z-0` behind all content
    - Respect reduced motion: show static stars without animation loop
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 16.7_

  - [x] 4.2 Write property test for Starfield star generation (Property 1)
    - **Property 1: Starfield generates correct star count**
    - Generate random starCount values 50-200, verify exactly that many star objects are created
    - **Validates: Requirements 4.1**

- [x] 5. Implement Navigation component
  - [x] 5.1 Create Navigation component with responsive menu
    - Create `src/components/Navigation.tsx` as a client component
    - Fixed top bar with semi-transparent dark background and backdrop blur
    - Display "PK" logo on the left
    - Desktop (≥1024px): horizontal link list for all sections
    - Mobile (<1024px): hamburger icon toggles slide-down menu
    - Implement smooth scroll on link click via `scrollIntoView({ behavior: 'smooth' })`
    - Close mobile menu after navigation link click
    - Integrate `useScrollSpy` hook for active section highlighting
    - Add aria-label to hamburger button, ensure keyboard accessibility
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 16.1, 16.6_

  - [x] 5.2 Write unit tests for Navigation component
    - Test all links render correctly
    - Test hamburger toggle on mobile viewport
    - Test active link highlighting
    - Test keyboard accessibility
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 6. Implement Hero Section
  - [x] 6.1 Create HeroSection component
    - Create `src/components/HeroSection.tsx` as a client component
    - Full viewport height (min-h-screen)
    - Display h1 with "Pavan Koundinya", subtitle "Software Development Engineer", and tagline
    - "Explore Mission" CTA button scrolling to Mission Brief section
    - "Download Resume" button with `<a href="/resume.pdf" download>`
    - Social icons (GitHub, LinkedIn, Email) opening in new tabs with aria-labels
    - Floating satellite/spacecraft SVG wireframe with CSS float animation
    - Staggered fade-in animation via Framer Motion (total ≤1500ms)
    - Respect reduced motion: all elements visible immediately, satellite static
    - Load content from Content_Store (profile.ts)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 16.6, 16.7, 19.6_

  - [x] 6.2 Write unit tests for HeroSection
    - Test h1 renders with correct name
    - Test CTA buttons have correct hrefs
    - Test social links open in new tab
    - _Requirements: 6.2, 6.5, 6.6, 6.7_

- [x] 7. Implement Mission Brief Section
  - [x] 7.1 Create MissionBriefSection component
    - Create `src/components/MissionBriefSection.tsx` as a client component
    - Display 4 expertise cards in 2×2 grid (desktop) or single column (mobile)
    - Show years of experience statistic, current role (title + company), domain expertise list
    - Animate cards with fade-in on viewport entry using useViewportAnimation
    - Load all content from profile.ts
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 19.6_

  - [x] 7.2 Write unit tests for MissionBriefSection
    - Test exactly 4 expertise cards render
    - Test stats display correctly
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 8. Checkpoint - Verify core structure
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement Timeline Section
  - [x] 9.1 Create TimelineSection component
    - Create `src/components/TimelineSection.tsx` as a client component
    - Vertical timeline with center line (desktop) or left-aligned (mobile)
    - Entries alternate left/right on desktop, all left on mobile
    - Display company, role, dates, description for each entry
    - "Current" badge on current role with accent border
    - Rocket SVG icon on timeline axis
    - Fade-in + horizontal slide animation on viewport entry (≤500ms)
    - Load data from experience.ts, render in reverse chronological order
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 19.6_

  - [x] 9.2 Write property test for timeline ordering (Property 3)
    - **Property 3: Timeline entries are reverse chronologically ordered**
    - Generate random ExperienceEntry arrays with valid dates, verify descending date sort
    - **Validates: Requirements 8.1**

  - [x] 9.3 Write unit tests for TimelineSection
    - Test "Current" badge renders on current role
    - Test rocket icon is present
    - Test entries display all required fields
    - _Requirements: 8.1, 8.2, 8.4_

- [x] 10. Implement Projects Section
  - [x] 10.1 Create ProjectsSection component
    - Create `src/components/ProjectsSection.tsx` as a client component
    - Responsive grid: 1 col (<768px), 2 cols (768-1023px), 3 cols (≥1024px)
    - Featured projects span 2 columns at ≥1024px, sorted before non-featured
    - Each card shows: name, description, tech tags, impact statement
    - Conditional GitHub/demo links based on data
    - Hover effect: scale transform + elevated shadow (150-300ms)
    - Load data from projects.ts
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 19.6_

  - [x] 10.2 Write property tests for Projects (Properties 4, 5, 6)
    - **Property 4: Project cards display all required fields**
    - **Property 5: Project cards conditionally render links**
    - **Property 6: Featured projects appear before non-featured**
    - Generate random Project objects, verify field rendering, link presence, and ordering
    - **Validates: Requirements 9.2, 9.3, 9.4**

  - [x] 10.3 Write unit tests for ProjectsSection
    - Test featured cards have col-span-2 class
    - Test links render conditionally
    - Test hover effect classes
    - _Requirements: 9.1, 9.4, 9.6_

- [x] 11. Implement Skills Section
  - [x] 11.1 Create SkillsSection component
    - Create `src/components/SkillsSection.tsx` as a client component
    - Group skills by category with distinct visual labels
    - Hover (desktop) or tap (mobile) reveals proficiency percentage
    - Fade-in animation on viewport entry (≤800ms)
    - Load data from skills.ts
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 19.6_

  - [x] 11.2 Write property tests for Skills (Properties 7, 8)
    - **Property 7: Skills are grouped by category**
    - **Property 8: Skill proficiency displays correct value**
    - Generate random SkillsData, verify grouping and proficiency display
    - **Validates: Requirements 10.1, 10.3**

- [x] 12. Implement Mission Log Section
  - [x] 12.1 Create MissionLogSection component
    - Create `src/components/MissionLogSection.tsx` as a client component
    - Terminal/monospace aesthetic with bordered panels
    - Display mission ID, description, category for each record
    - Sequential fade-in with 150-300ms stagger
    - Empty state: "No mission records available" placeholder
    - Load data from achievements.ts
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 19.6_

  - [x] 12.2 Write property test for achievements (Property 9)
    - **Property 9: Achievement records display all fields**
    - Generate random Achievement objects, verify all fields rendered
    - **Validates: Requirements 11.1**

- [x] 13. Checkpoint - Verify content sections
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement Resume Section
  - [x] 14.1 Create ResumeSection component
    - Create `src/components/ResumeSection.tsx` as a client component
    - Display professional summary (≤300 chars) from profile.ts
    - Download button with `<a href="/resume.pdf" download>` and accessible label
    - Error state: show "Resume currently unavailable" if PDF is missing (check via fetch HEAD or onError)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 19.6_

  - [x] 14.2 Write unit tests for ResumeSection
    - Test download button has correct href and download attribute
    - Test error state renders when PDF unavailable
    - _Requirements: 12.2, 12.3, 12.4_

- [x] 15. Implement Contact Section
  - [x] 15.1 Create ContactSection component
    - Create `src/components/ContactSection.tsx` as a client component
    - Form fields: Name (max 100), Email (max 254), Message (max 2000)
    - Client-side validation: required check + email regex, inline errors per field
    - Form states: idle, submitting, success, error
    - Submission via Formspree POST or mailto fallback
    - Preserve form data on failure, show error message
    - Success: confirmation message, clear fields
    - Social links: GitHub, LinkedIn, Email
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [x] 15.2 Write property tests for Contact form (Properties 10, 11)
    - **Property 10: Contact form validates empty required fields**
    - **Property 11: Contact form validates email format**
    - Generate form states with random empty fields and invalid emails, verify validation errors
    - **Validates: Requirements 13.4, 13.5**

  - [x] 15.3 Write unit tests for ContactSection
    - Test validation errors appear for empty fields
    - Test success and error states render correctly
    - Test social links render
    - _Requirements: 13.1, 13.4, 13.5, 13.6_

- [x] 16. Implement Footer component
  - [x] 16.1 Create Footer component
    - Create `src/components/Footer.tsx`
    - Display name "Pavan Koundinya" and title "Software Development Engineer"
    - "Built with Next.js" attribution
    - Current copyright year via `new Date().getFullYear()`
    - Social links (GitHub, LinkedIn, Email) opening in new tab with `target="_blank" rel="noopener noreferrer"`
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 16.2 Write unit tests for Footer
    - Test copyright year is current
    - Test social links have target="_blank"
    - Test attribution text renders
    - _Requirements: 14.1, 14.2, 14.4, 14.5_

- [x] 17. Assemble page and wire components together
  - [x] 17.1 Create main page component
    - Create `src/app/page.tsx` composing all sections in order:
      - Starfield (fixed background)
      - Navigation (fixed top)
      - main element containing: HeroSection, MissionBriefSection, TimelineSection, ProjectsSection, SkillsSection, MissionLogSection, ResumeSection, ContactSection
      - Footer
    - Add section IDs for scroll navigation (mission-brief, experience, projects, skills, mission-log, resume, contact)
    - Ensure semantic HTML structure (nav, main, section, footer)
    - Verify single h1 on page, no skipped heading levels
    - _Requirements: 5.3, 5.6, 16.2, 16.3, 19.6_

  - [x] 17.2 Write property tests for page structure (Properties 12, 13, 14)
    - **Property 12: Heading hierarchy is valid**
    - **Property 13: Reduced motion disables non-essential animations**
    - **Property 14: No animation exceeds maximum duration**
    - Render full page, verify h1 count, heading order, reduced motion behavior, and animation durations
    - **Validates: Requirements 16.3, 16.7, 20.4, 20.6**

- [x] 18. Checkpoint - Full page integration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Implement responsive design and accessibility polish
  - [x] 19.1 Ensure responsive layouts across all breakpoints
    - Verify no horizontal scrolling at 320px+
    - Verify single-column layout below 768px
    - Verify multi-column layouts at 768px+
    - Ensure all touch targets are minimum 44x44px on mobile
    - Test all breakpoints: 320px, 768px, 1024px, 1440px
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 19.2 Implement accessibility requirements
    - Verify keyboard navigation for all interactive elements (Tab, Enter, Space)
    - Add visible focus indicators (minimum 2px outline)
    - Verify aria-labels on all icon-only buttons
    - Verify semantic HTML elements throughout
    - Add alt text for informative images, aria-hidden for decorative ones
    - Verify WCAG 2.1 AA contrast ratios (4.5:1 normal text, 3:1 large text)
    - _Requirements: 16.1, 16.2, 16.4, 16.5, 16.6_

- [x] 20. Implement GitHub Actions deployment workflow
  - [x] 20.1 Create GitHub Actions workflow for GitHub Pages deployment
    - Create `.github/workflows/deploy.yml`
    - Trigger on push to main branch
    - Steps: checkout, setup Node.js, npm ci, npm run build, upload artifact, deploy to GitHub Pages
    - Configure base path environment variable for GitHub Pages URL
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 21. Add static assets and final configuration
  - [x] 21.1 Add resume PDF and static assets
    - Place `resume.pdf` in `public/` directory
    - Add any OG image (1200x630px minimum) to `public/` for social sharing
    - Ensure all assets use relative paths compatible with base path configuration
    - _Requirements: 6.6, 12.2, 17.3, 18.2_

- [ ] 22. Final checkpoint - Build verification and deployment readiness
  - Ensure all tests pass, ask the user if questions arise.
  - Run `npm run build` and verify static export produces `out/` directory with zero errors
  - Verify all navigation links resolve when serving static files

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All content is driven from `src/data/` files — no hardcoded strings in components
- The site is dark-mode only with the Mission Control theme throughout
- Static export means no API routes or server-side logic at runtime

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"] },
    { "id": 3, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 4, "tasks": ["3.4", "4.1", "5.1", "6.1", "16.1"] },
    { "id": 5, "tasks": ["4.2", "5.2", "6.2", "7.1", "16.2"] },
    { "id": 6, "tasks": ["7.2", "9.1", "10.1", "11.1", "12.1"] },
    { "id": 7, "tasks": ["9.2", "9.3", "10.2", "10.3", "11.2", "12.2"] },
    { "id": 8, "tasks": ["14.1", "15.1"] },
    { "id": 9, "tasks": ["14.2", "15.2", "15.3"] },
    { "id": 10, "tasks": ["17.1"] },
    { "id": 11, "tasks": ["17.2", "19.1", "19.2"] },
    { "id": 12, "tasks": ["20.1", "21.1"] }
  ]
}
```
