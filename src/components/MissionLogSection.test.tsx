import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MissionLogSection from './MissionLogSection';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, whileInView, viewport, animate, ...rest } = props;
      void variants; void initial; void whileInView; void viewport; void animate;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
      );
      return <div {...(filteredProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
    },
  },
}));

// Mock useReducedMotion hook
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
  default: () => false,
}));

describe('MissionLogSection', () => {
  it('renders the section with id="mission-log"', () => {
    const { container } = render(<MissionLogSection />);
    const section = container.querySelector('#mission-log');
    expect(section).toBeInTheDocument();
  });

  it('renders the "Mission Log" heading', () => {
    render(<MissionLogSection />);
    expect(screen.getByRole('heading', { name: 'Mission Log' })).toBeInTheDocument();
  });

  it('uses monospace font class on the terminal body', () => {
    const { container } = render(<MissionLogSection />);
    const monoElements = container.querySelectorAll('.font-mono');
    expect(monoElements.length).toBeGreaterThan(0);
  });

  it('displays mission IDs for each achievement', () => {
    render(<MissionLogSection />);
    expect(screen.getByText(/MSN-001/)).toBeInTheDocument();
    expect(screen.getByText(/MSN-002/)).toBeInTheDocument();
    expect(screen.getByText(/MSN-003/)).toBeInTheDocument();
  });

  it('displays descriptions for each achievement', () => {
    render(<MissionLogSection />);
    expect(screen.getByText(/Reduced API latency by 40%/)).toBeInTheDocument();
    expect(screen.getByText(/event-driven architecture/)).toBeInTheDocument();
  });

  it('displays category labels for each achievement', () => {
    render(<MissionLogSection />);
    expect(screen.getAllByText('Performance').length).toBeGreaterThan(0);
    expect(screen.getByText('Architecture')).toBeInTheDocument();
    expect(screen.getAllByText('Innovation').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Leadership').length).toBeGreaterThan(0);
  });

  it('renders bordered panels with space-accent border', () => {
    const { container } = render(<MissionLogSection />);
    const borderedPanels = container.querySelectorAll('[class*="border-space-accent"]');
    expect(borderedPanels.length).toBeGreaterThan(0);
  });

  it('has aria-label for accessibility', () => {
    render(<MissionLogSection />);
    expect(screen.getByLabelText('Mission Log')).toBeInTheDocument();
  });

  it('renders terminal header with window controls', () => {
    render(<MissionLogSection />);
    expect(screen.getByText('mission-log.terminal')).toBeInTheDocument();
  });

  it('displays ">" prompt character before mission IDs', () => {
    render(<MissionLogSection />);
    expect(screen.getByText(/> MSN-001/)).toBeInTheDocument();
  });
});

describe('MissionLogSection - empty state', () => {
  it('displays placeholder when no achievements are available', async () => {
    vi.resetModules();

    vi.doMock('framer-motion', () => ({
      motion: {
        div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
          const { variants, initial, whileInView, viewport, animate, ...rest } = props;
          void variants; void initial; void whileInView; void viewport; void animate;
          const filteredProps = Object.fromEntries(
            Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
          );
          return <div {...(filteredProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
        },
      },
    }));

    vi.doMock('../hooks/useReducedMotion', () => ({
      useReducedMotion: () => false,
      default: () => false,
    }));

    vi.doMock('../data/achievements', () => ({
      achievements: [],
    }));

    const { default: MissionLogSectionEmpty } = await import('./MissionLogSection');
    render(<MissionLogSectionEmpty />);
    expect(screen.getByText('No mission records available')).toBeInTheDocument();
  });
});
