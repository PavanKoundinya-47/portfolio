import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResumeSection from './ResumeSection';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, ref, ...rest } = props;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
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
  default: () => ({
    ref: { current: null },
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 },
  }),
}));

describe('ResumeSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('when PDF is available', () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true });
    });

    it('renders download link with correct href and download attribute', async () => {
      render(<ResumeSection />);

      await waitFor(() => {
        const link = screen.getByRole('link', { name: /download resume pdf/i });
        expect(link).toHaveAttribute('href', '/resume.pdf');
        expect(link).toHaveAttribute('download');
      });
    });

    it('download link has aria-label="Download resume PDF"', async () => {
      render(<ResumeSection />);

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'Download resume PDF' });
        expect(link).toHaveAttribute('aria-label', 'Download resume PDF');
      });
    });

    it('displays the professional summary text', async () => {
      render(<ResumeSection />);

      await waitFor(() => {
        expect(
          screen.getByText(/Software Development Engineer with expertise/i)
        ).toBeInTheDocument();
      });
    });

    it('section has id="resume"', () => {
      const { container } = render(<ResumeSection />);
      const section = container.querySelector('section#resume');
      expect(section).toBeInTheDocument();
    });
  });

  describe('when PDF is unavailable (404)', () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    });

    it('shows "Resume currently unavailable" message', async () => {
      render(<ResumeSection />);

      await waitFor(() => {
        expect(screen.getByText('Resume currently unavailable')).toBeInTheDocument();
      });
    });

    it('does not render the download link', async () => {
      render(<ResumeSection />);

      await waitFor(() => {
        expect(screen.getByText('Resume currently unavailable')).toBeInTheDocument();
      });

      expect(screen.queryByRole('link', { name: /download resume pdf/i })).not.toBeInTheDocument();
    });
  });

  describe('when fetch fails with network error', () => {
    beforeEach(() => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    });

    it('shows error state when fetch throws', async () => {
      render(<ResumeSection />);

      await waitFor(() => {
        expect(screen.getByText('Resume currently unavailable')).toBeInTheDocument();
      });
    });
  });
});
