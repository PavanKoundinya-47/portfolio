import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProjectsSection from './ProjectsSection';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, ...rest } = props;
      void initial; void animate; void transition;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
      );
      return <div {...(filteredProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
    },
  },
}));

// Mock useViewportAnimation hook
vi.mock('../hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => ({
    ref: { current: null },
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 },
  }),
  default: () => ({
    ref: { current: null },
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 },
  }),
}));

describe('ProjectsSection', () => {
  it('renders section with id="projects"', () => {
    const { container } = render(<ProjectsSection />);
    const section = container.querySelector('section#projects');
    expect(section).toBeInTheDocument();
  });

  it('renders the "Projects" heading', () => {
    render(<ProjectsSection />);
    expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument();
  });

  it('featured project cards have lg:col-span-2 class', () => {
    const { container } = render(<ProjectsSection />);
    const featuredCards = container.querySelectorAll('.lg\\:col-span-2');
    // There are 2 featured projects: Customer Data Dissemination Platform (Azista) and Mission Tasking Dashboard (Kaleideo)
    expect(featuredCards.length).toBe(2);
  });

  it('does not render any GitHub or Demo links since no projects have URLs', () => {
    render(<ProjectsSection />);
    // No projects have githubUrl or demoUrl
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument();
    expect(screen.queryByText('Demo')).not.toBeInTheDocument();
  });

  it('cards have hover effect classes', () => {
    const { container } = render(<ProjectsSection />);
    const cardsWithHoverScale = container.querySelectorAll('.hover\\:scale-\\[1\\.02\\]');
    const cardsWithHoverShadow = container.querySelectorAll('.hover\\:shadow-lg');
    // All 6 project cards should have hover effects
    expect(cardsWithHoverScale.length).toBe(6);
    expect(cardsWithHoverShadow.length).toBe(6);
  });

  it('has aria-label for accessibility', () => {
    render(<ProjectsSection />);
    expect(screen.getByLabelText('Projects')).toBeInTheDocument();
  });

  it('renders all project names', () => {
    render(<ProjectsSection />);
    // Both "Customer Data Dissemination Platform" entries should render
    const cdpEntries = screen.getAllByText('Customer Data Dissemination Platform');
    expect(cdpEntries.length).toBe(2);
    expect(screen.getByText('Image Tasking Platform')).toBeInTheDocument();
    expect(screen.getByText('Satellite Health Monitoring Tool')).toBeInTheDocument();
    expect(screen.getByText('Mission Tasking Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Image Tasking Application')).toBeInTheDocument();
  });

  it('featured projects appear before non-featured projects', () => {
    const { container } = render(<ProjectsSection />);
    const cards = container.querySelectorAll('.bg-space-surface');
    const cardNames = Array.from(cards).map(
      (card) => card.querySelector('h3')?.textContent
    );
    // First two should be featured
    expect(cardNames[0]).toBe('Customer Data Dissemination Platform');
    expect(cardNames[1]).toBe('Mission Tasking Dashboard');
  });
});
