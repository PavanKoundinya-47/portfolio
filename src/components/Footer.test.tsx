import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders "Pavan Lanka" name', () => {
    render(<Footer />);
    expect(screen.getByText('Pavan Lanka')).toBeInTheDocument();
  });

  it('renders "Software Development Engineer" title', () => {
    render(<Footer />);
    expect(screen.getByText('Software Development Engineer')).toBeInTheDocument();
  });

  it('renders "Built with Next.js" attribution text', () => {
    render(<Footer />);
    expect(screen.getByText('Built with Next.js')).toBeInTheDocument();
  });

  it('displays the current copyright year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('renders social links with target="_blank"', () => {
    render(<Footer />);
    const githubLink = screen.getByLabelText('Visit GitHub profile');
    const linkedinLink = screen.getByLabelText('Visit LinkedIn profile');
    const emailLink = screen.getByLabelText('Send an email');

    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(emailLink).toHaveAttribute('target', '_blank');
  });

  it('renders social links with rel="noopener noreferrer"', () => {
    render(<Footer />);
    const githubLink = screen.getByLabelText('Visit GitHub profile');
    const linkedinLink = screen.getByLabelText('Visit LinkedIn profile');
    const emailLink = screen.getByLabelText('Send an email');

    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('social links have aria-labels for accessibility', () => {
    render(<Footer />);
    expect(screen.getByLabelText('Visit GitHub profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Visit LinkedIn profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Send an email')).toBeInTheDocument();
  });

  it('renders a footer semantic element', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });
});
