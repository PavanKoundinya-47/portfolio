import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TimelineSection from './TimelineSection';

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
}));

// Mock useViewportAnimation hook
vi.mock('../hooks/useViewportAnimation', () => ({
  useViewportAnimation: () => ({
    ref: { current: null },
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 },
  }),
}));

describe('TimelineSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Current badge', () => {
    it('renders "Current" badge on the Kaleideo Space Systems entry (isCurrent: true)', () => {
      render(<TimelineSection />);
      expect(screen.getByText('Current')).toBeInTheDocument();
    });

    it('renders "Current" badge only once (only one current role)', () => {
      render(<TimelineSection />);
      const badges = screen.getAllByText('Current');
      expect(badges).toHaveLength(1);
    });
  });

  describe('Rocket icon', () => {
    it('renders a rocket SVG icon with aria-hidden="true"', () => {
      const { container } = render(<TimelineSection />);
      const svg = container.querySelector('svg[aria-hidden="true"]');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Entry fields', () => {
    it('displays company names for all entries', () => {
      render(<TimelineSection />);
      expect(screen.getByText('Kaleideo Space Systems')).toBeInTheDocument();
      expect(screen.getByText('Azista Industries')).toBeInTheDocument();
    });

    it('displays role titles for all entries', () => {
      render(<TimelineSection />);
      const softwareEngineerEntries = screen.getAllByText('Software Engineer');
      expect(softwareEngineerEntries.length).toBe(2);
    });

    it('displays dates for all entries', () => {
      render(<TimelineSection />);
      expect(screen.getByText(/Jan 2024/)).toBeInTheDocument();
      expect(screen.getByText(/Jun 2022/)).toBeInTheDocument();
    });

    it('displays "Present" for current role end date', () => {
      render(<TimelineSection />);
      expect(screen.getByText(/Present/)).toBeInTheDocument();
    });

    it('displays descriptions for all entries', () => {
      render(<TimelineSection />);
      expect(screen.getByText(/Building mission-critical software/)).toBeInTheDocument();
      expect(screen.getByText(/Designed and built ground segment software/)).toBeInTheDocument();
    });
  });

  describe('Section structure', () => {
    it('has section with id="experience"', () => {
      const { container } = render(<TimelineSection />);
      const section = container.querySelector('#experience');
      expect(section).toBeInTheDocument();
    });

    it('renders "Flight Log" heading', () => {
      render(<TimelineSection />);
      expect(
        screen.getByRole('heading', { level: 2, name: /flight log/i })
      ).toBeInTheDocument();
    });
  });
});
