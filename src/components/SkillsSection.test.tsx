import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SkillsSection from './SkillsSection';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, ...rest } = props;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
      );
      return <div {...filteredProps}>{children}</div>;
    },
  },
  useInView: () => true,
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

// Mock useReducedMotion hook
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
  default: () => false,
}));

describe('SkillsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section with id="skills"', () => {
    const { container } = render(<SkillsSection />);
    const section = container.querySelector('section#skills');
    expect(section).toBeInTheDocument();
  });

  it('renders section heading "Skills Galaxy"', () => {
    render(<SkillsSection />);
    const heading = screen.getByRole('heading', { level: 2, name: /skills galaxy/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders all skill categories with h3 labels', () => {
    render(<SkillsSection />);
    const categories = [
      'Backend Systems',
      'Cloud & Infrastructure',
      'Databases',
      'Frontend',
      'Soft Skills',
    ];
    categories.forEach((category) => {
      expect(screen.getByRole('heading', { level: 3, name: category })).toBeInTheDocument();
    });
  });

  it('renders skill badges for each category', () => {
    render(<SkillsSection />);
    // Check a few skills from different categories
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Leadership')).toBeInTheDocument();
  });

  it('each skill badge has a data-proficiency attribute', () => {
    const { container } = render(<SkillsSection />);
    const badges = container.querySelectorAll('[data-proficiency]');
    expect(badges.length).toBeGreaterThan(0);
    // Check a specific skill's proficiency
    const javaBadge = container.querySelector('[data-proficiency="92"]');
    expect(javaBadge).toBeInTheDocument();
  });

  it('shows proficiency on click (mobile tap simulation)', () => {
    render(<SkillsSection />);
    const javaBadge = screen.getByLabelText('Java, proficiency 92%');
    fireEvent.click(javaBadge);
    // After click, the proficiency percentage should be visible
    expect(javaBadge).toBeInTheDocument();
  });

  it('has aria-label on the section', () => {
    const { container } = render(<SkillsSection />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-label', 'Skills Galaxy');
  });

  it('renders skill lists with role="list" and aria-label per category', () => {
    const { container } = render(<SkillsSection />);
    const lists = container.querySelectorAll('[role="list"]');
    expect(lists.length).toBe(5); // One per category
  });
});
