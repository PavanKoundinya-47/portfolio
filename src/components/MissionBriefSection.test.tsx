import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MissionBriefSection from './MissionBriefSection';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, animate, transition, ...rest } = props;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(
          ([key]) => !key.startsWith('on') || key === 'onClick'
        )
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

describe('MissionBriefSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Expertise Cards', () => {
    it('renders exactly 4 expertise cards with correct titles', () => {
      render(<MissionBriefSection />);
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(4);
      expect(headings[0]).toHaveTextContent('Backend Engineering');
      expect(headings[1]).toHaveTextContent('Distributed Systems');
      expect(headings[2]).toHaveTextContent('Cloud Technologies');
      expect(headings[3]).toHaveTextContent('Space Technology');
    });
  });

  describe('Stats Display', () => {
    it('displays years of experience statistic (3+)', () => {
      const { container } = render(<MissionBriefSection />);
      // The "3" and "+" are rendered as "{profile.yearsOfExperience}+"
      const statElement = container.querySelector('.text-3xl.font-bold.text-space-accent');
      expect(statElement).toBeInTheDocument();
      expect(statElement).toHaveTextContent('3+');
      expect(screen.getByText('Years of Experience')).toBeInTheDocument();
    });

    it('displays current role title "Software Engineer"', () => {
      render(<MissionBriefSection />);
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    it('displays current company "at Kaleideo Space Systems"', () => {
      render(<MissionBriefSection />);
      expect(screen.getByText(/at Kaleideo Space Systems/)).toBeInTheDocument();
    });

    it('displays domain expertise items as list items', () => {
      render(<MissionBriefSection />);
      const list = screen.getByRole('list');
      const items = within(list).getAllByRole('listitem');
      expect(items.length).toBeGreaterThanOrEqual(5);
      expect(items[0]).toHaveTextContent('Backend Engineering');
      expect(items[1]).toHaveTextContent('Distributed Systems');
      expect(items[2]).toHaveTextContent('Cloud Infrastructure');
      expect(items[3]).toHaveTextContent('Microservices Architecture');
      expect(items[4]).toHaveTextContent('Space Technology');
    });

    it('has section with id="mission-brief"', () => {
      const { container } = render(<MissionBriefSection />);
      const section = container.querySelector('#mission-brief');
      expect(section).toBeInTheDocument();
    });

    it('renders "Mission Brief" heading', () => {
      render(<MissionBriefSection />);
      expect(
        screen.getByRole('heading', { level: 2, name: /mission brief/i })
      ).toBeInTheDocument();
    });
  });
});
