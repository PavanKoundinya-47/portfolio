import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactSection from './ContactSection';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, transition, variants, ...rest } = props;
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
    initial: {},
    animate: {},
    transition: {},
  }),
}));

describe('ContactSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('Section structure', () => {
    it('renders section with id="contact"', () => {
      const { container } = render(<ContactSection />);
      const section = container.querySelector('section#contact');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Form validation - empty fields', () => {
    it('shows "Name is required" when submitting with empty name', async () => {
      render(<ContactSection />);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      fireEvent.click(submitButton);

      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    it('shows "Email is required" when submitting with empty email', async () => {
      render(<ContactSection />);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      fireEvent.click(submitButton);

      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('shows "Message is required" when submitting with empty message', async () => {
      render(<ContactSection />);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      fireEvent.click(submitButton);

      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });

    it('shows all validation errors simultaneously for all empty fields', () => {
      render(<ContactSection />);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      fireEvent.click(submitButton);

      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
  });

  describe('Form validation - invalid email', () => {
    it('shows "Please enter a valid email address" for invalid email format', () => {
      render(<ContactSection />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const messageInput = screen.getByLabelText('Message');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(messageInput, { target: { value: 'Hello there' } });

      const submitButton = screen.getByRole('button', { name: /send message/i });
      fireEvent.click(submitButton);

      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  describe('Form field maxLength attributes', () => {
    it('name field has maxLength of 100', () => {
      render(<ContactSection />);
      const nameInput = screen.getByLabelText('Name');
      expect(nameInput).toHaveAttribute('maxLength', '100');
    });

    it('email field has maxLength of 254', () => {
      render(<ContactSection />);
      const emailInput = screen.getByLabelText('Email');
      expect(emailInput).toHaveAttribute('maxLength', '254');
    });

    it('message field has maxLength of 2000', () => {
      render(<ContactSection />);
      const messageInput = screen.getByLabelText('Message');
      expect(messageInput).toHaveAttribute('maxLength', '2000');
    });
  });

  describe('Success state', () => {
    it('shows "Message sent successfully!" after successful submission', async () => {
      // Mock Formspree endpoint
      vi.stubEnv('NEXT_PUBLIC_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test');
      global.fetch = vi.fn().mockResolvedValue({ ok: true });

      render(<ContactSection />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const messageInput = screen.getByLabelText('Message');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Hello there' } });

      const submitButton = screen.getByRole('button', { name: /send message/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
      });

      vi.unstubAllEnvs();
    });
  });

  describe('Error state', () => {
    it('shows error message when submission fails', async () => {
      vi.stubEnv('NEXT_PUBLIC_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test');
      global.fetch = vi.fn().mockResolvedValue({ ok: false });

      render(<ContactSection />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const messageInput = screen.getByLabelText('Message');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Hello there' } });

      const submitButton = screen.getByRole('button', { name: /send message/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            'Something went wrong. Please try again or use the email link below.'
          )
        ).toBeInTheDocument();
      });

      vi.unstubAllEnvs();
    });

    it('preserves form data on submission error', async () => {
      vi.stubEnv('NEXT_PUBLIC_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test');
      global.fetch = vi.fn().mockResolvedValue({ ok: false });

      render(<ContactSection />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const messageInput = screen.getByLabelText('Message');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(messageInput, { target: { value: 'Hello there' } });

      const submitButton = screen.getByRole('button', { name: /send message/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            'Something went wrong. Please try again or use the email link below.'
          )
        ).toBeInTheDocument();
      });

      // Form data should be preserved
      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(messageInput).toHaveValue('Hello there');

      vi.unstubAllEnvs();
    });
  });

  describe('Social links', () => {
    it('renders GitHub social link with correct attributes', () => {
      render(<ContactSection />);
      const githubLink = screen.getByLabelText('Visit GitHub profile');
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute('href', 'https://github.com/PavanKoundinya-47');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders LinkedIn social link with correct attributes', () => {
      render(<ContactSection />);
      const linkedinLink = screen.getByLabelText('Visit LinkedIn profile');
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/pavanlanka-profile');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders Email social link with correct attributes', () => {
      render(<ContactSection />);
      const emailLink = screen.getByLabelText('Send an email');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', 'mailto:pavan.lanka@example.com');
      expect(emailLink).toHaveAttribute('target', '_blank');
      expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
