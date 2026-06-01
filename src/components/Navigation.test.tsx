import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from './Navigation';

// Mock useScrollSpy hook
vi.mock('../hooks/useScrollSpy', () => ({
  useScrollSpy: () => 'experience',
}));

describe('Navigation', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders the PK logo', () => {
    render(<Navigation />);
    expect(screen.getByText('PK')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navigation />);
    const expectedLinks = [
      'Mission Brief',
      'Experience',
      'Projects',
      'Skills',
      'Mission Log',
      'Resume',
      'Contact',
    ];
    expectedLinks.forEach((label) => {
      // Each link appears twice (desktop + mobile)
      const links = screen.getAllByText(label);
      expect(links.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders hamburger button with correct aria-label', () => {
    render(<Navigation />);
    const button = screen.getByLabelText('Toggle navigation menu');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles mobile menu on hamburger click', () => {
    render(<Navigation />);
    const button = screen.getByLabelText('Toggle navigation menu');

    // Initially closed
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes mobile menu on link click', () => {
    render(<Navigation />);
    const button = screen.getByLabelText('Toggle navigation menu');

    // Open menu
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Click a mobile link (get all links with that text, pick the last one which is in mobile menu)
    const links = screen.getAllByText('Projects');
    fireEvent.click(links[links.length - 1]);

    // Menu should be closed
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls scrollIntoView with smooth behavior on link click', () => {
    // Create a target element
    const targetEl = document.createElement('div');
    targetEl.id = 'projects';
    document.body.appendChild(targetEl);

    render(<Navigation />);
    const links = screen.getAllByText('Projects');
    fireEvent.click(links[0]);

    expect(targetEl.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(targetEl);
  });

  it('highlights the active section link', () => {
    render(<Navigation />);
    // useScrollSpy is mocked to return 'experience'
    const experienceLinks = screen.getAllByText('Experience');
    // At least one should have the active class
    const hasActiveClass = experienceLinks.some(
      (link) => link.className.includes('text-space-accent')
    );
    expect(hasActiveClass).toBe(true);
  });

  it('has keyboard accessible hamburger button', () => {
    render(<Navigation />);
    const button = screen.getByLabelText('Toggle navigation menu');

    // Should be focusable (it's a button element)
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('uses semantic nav element with aria-label', () => {
    render(<Navigation />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });
});
