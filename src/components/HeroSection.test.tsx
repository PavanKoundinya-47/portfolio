import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeroSection from './HeroSection';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, animate, ...rest } = props;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
      );
      return <div {...filteredProps}>{children}</div>;
    },
    h1: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, animate, ...rest } = props;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
      );
      return <h1 {...filteredProps}>{children}</h1>;
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { variants, initial, animate, ...rest } = props;
      const filteredProps = Object.fromEntries(
        Object.entries(rest).filter(([key]) => !key.startsWith('on') || key === 'onClick')
      );
      return <p {...filteredProps}>{children}</p>;
    },
  },
  useReducedMotion: () => false,
}));

// Mock useReducedMotion hook
vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
  default: () => false,
}));

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders h1 with "Pavan Lanka"', () => {
    render(<HeroSection />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Pavan Lanka');
  });

  it('renders subtitle "Software Development Engineer"', () => {
    render(<HeroSection />);
    expect(screen.getByText('Software Development Engineer')).toBeInTheDocument();
  });

  it('renders tagline from profile data', () => {
    render(<HeroSection />);
    expect(
      screen.getByText(
        'Building scalable software systems on Earth while contributing to space technology.'
      )
    ).toBeInTheDocument();
  });

  it('renders "Explore Mission" button', () => {
    render(<HeroSection />);
    const button = screen.getByRole('button', { name: /explore mission/i });
    expect(button).toBeInTheDocument();
  });

  it('renders "Download Resume" link with correct href and download attribute', () => {
    render(<HeroSection />);
    const link = screen.getByRole('link', { name: /download resume/i });
    expect(link).toHaveAttribute('href', '/resume.pdf');
    expect(link).toHaveAttribute('download');
  });

  it('renders social icons with correct attributes', () => {
    render(<HeroSection />);

    const githubLink = screen.getByLabelText('Visit GitHub profile');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/PavanKoundinya-47');

    const linkedinLink = screen.getByLabelText('Visit LinkedIn profile');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/pavanlanka-profile');

    const emailLink = screen.getByLabelText('Send an email');
    expect(emailLink).toHaveAttribute('target', '_blank');
    expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(emailLink).toHaveAttribute('href', 'mailto:pavan.lanka@example.com');
  });

  it('has min-h-screen class for full viewport height', () => {
    const { container } = render(<HeroSection />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('min-h-screen');
  });

  it('"Explore Mission" button scrolls to mission-brief section', () => {
    const mockScrollIntoView = vi.fn();
    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = mockScrollIntoView;
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    render(<HeroSection />);
    const button = screen.getByRole('button', { name: /explore mission/i });
    fireEvent.click(button);

    expect(document.getElementById).toHaveBeenCalledWith('mission-brief');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('renders satellite SVG with aria-hidden', () => {
    const { container } = render(<HeroSection />);
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).toBeInTheDocument();
  });

  it('satellite has animate-float class when reduced motion is not preferred', () => {
    const { container } = render(<HeroSection />);
    const satelliteContainer = container.querySelector('.animate-float');
    expect(satelliteContainer).toBeInTheDocument();
  });
});

describe('HeroSection with reduced motion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('satellite does not have animate-float class when reduced motion is preferred', async () => {
    // Re-mock with reduced motion enabled
    vi.doMock('../hooks/useReducedMotion', () => ({
      useReducedMotion: () => true,
      default: () => true,
    }));

    // Dynamic import to get the module with new mock
    const { default: HeroSectionReduced } = await import('./HeroSection');
    const { container } = render(<HeroSectionReduced />);

    // The satellite container should not have animate-float
    const satelliteWrapper = container.querySelector('[aria-hidden="true"]')?.parentElement;
    if (satelliteWrapper) {
      expect(satelliteWrapper.className).not.toContain('animate-float');
    }
  });
});
