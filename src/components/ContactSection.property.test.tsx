import * as fc from 'fast-check';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

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

import ContactSection from './ContactSection';

/**
 * Arbitrary generator for whitespace-only or empty strings.
 */
const emptyOrWhitespaceArbitrary = fc.oneof(
  fc.constant(''),
  fc.array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 10 }).map((arr) => arr.join(''))
);

/**
 * Arbitrary generator for non-empty, non-whitespace strings (valid field values).
 */
const nonEmptyStringArbitrary = fc
  .string({ minLength: 1, maxLength: 50 })
  .filter((s) => s.trim().length > 0);

/**
 * Arbitrary generator for valid email addresses.
 */
const validEmailArbitrary = fc
  .tuple(
    fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /^[^\s@]+$/.test(s) && s.length > 0),
    fc.string({ minLength: 1, maxLength: 15 }).filter((s) => /^[^\s@]+$/.test(s) && s.length > 0),
    fc.string({ minLength: 2, maxLength: 6 }).filter((s) => /^[^\s@]+$/.test(s) && s.length > 0)
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

/**
 * Arbitrary generator for invalid email strings (no valid email pattern).
 */
const invalidEmailArbitrary = fc.oneof(
  // No @ symbol at all
  fc.string({ minLength: 1, maxLength: 30 }).filter((s) => !s.includes('@') && s.trim().length > 0),
  // Multiple @ symbols
  fc.tuple(
    fc.string({ minLength: 1, maxLength: 10 }).filter((s) => s.trim().length > 0),
    fc.string({ minLength: 1, maxLength: 10 }).filter((s) => s.trim().length > 0),
    fc.string({ minLength: 1, maxLength: 10 }).filter((s) => s.trim().length > 0)
  ).map(([a, b, c]) => `${a}@${b}@${c}`),
  // @ at start (empty local part)
  fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0).map((s) => `@${s}`),
  // @ at end (empty domain)
  fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0 && !s.includes('@')).map((s) => `${s}@`),
  // Has spaces in it
  fc.tuple(
    fc.string({ minLength: 1, maxLength: 10 }).filter((s) => s.trim().length > 0),
    fc.string({ minLength: 1, maxLength: 10 }).filter((s) => s.trim().length > 0)
  ).map(([a, b]) => `${a} @${b}`)
);

/**
 * Property 10: Contact form validates empty required fields
 *
 * For any combination of form field values where at least one required field
 * (Name, Email, or Message) is empty or whitespace-only, form submission SHALL
 * be prevented and a validation error message SHALL appear adjacent to each
 * empty/invalid field.
 *
 * Validates: Requirements 13.4
 */
describe('Feature: portfolio-website, Property 10: Contact form validates empty required fields', () => {
  it('shows validation error for each empty/whitespace field when form is submitted', () => {
    // Generate form states where at least one field is empty/whitespace
    const formStateArbitrary = fc
      .tuple(
        fc.oneof(emptyOrWhitespaceArbitrary, nonEmptyStringArbitrary),
        fc.oneof(emptyOrWhitespaceArbitrary, validEmailArbitrary),
        fc.oneof(emptyOrWhitespaceArbitrary, nonEmptyStringArbitrary)
      )
      .filter(([name, email, message]) => {
        // At least one field must be empty/whitespace
        return !name.trim() || !email.trim() || !message.trim();
      });

    fc.assert(
      fc.property(formStateArbitrary, ([name, email, message]) => {
        const { container, unmount } = render(<ContactSection />);

        // Fill in the form fields
        const nameInput = container.querySelector('#contact-name') as HTMLInputElement;
        const emailInput = container.querySelector('#contact-email') as HTMLInputElement;
        const messageInput = container.querySelector('#contact-message') as HTMLTextAreaElement;

        fireEvent.change(nameInput, { target: { value: name } });
        fireEvent.change(emailInput, { target: { value: email } });
        fireEvent.change(messageInput, { target: { value: message } });

        // Submit the form
        const form = container.querySelector('form') as HTMLFormElement;
        fireEvent.submit(form);

        // Verify validation errors appear for each empty/whitespace field
        if (!name.trim()) {
          const nameError = container.querySelector('#contact-name-error');
          expect(nameError).not.toBeNull();
          expect(nameError!.textContent).toBe('Name is required');
        }

        if (!email.trim()) {
          const emailError = container.querySelector('#contact-email-error');
          expect(emailError).not.toBeNull();
          expect(emailError!.textContent).toBe('Email is required');
        }

        if (!message.trim()) {
          const messageError = container.querySelector('#contact-message-error');
          expect(messageError).not.toBeNull();
          expect(messageError!.textContent).toBe('Message is required');
        }

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('prevents form submission when required fields are empty', () => {
    // All fields empty - form should not submit
    fc.assert(
      fc.property(
        fc.tuple(emptyOrWhitespaceArbitrary, emptyOrWhitespaceArbitrary, emptyOrWhitespaceArbitrary),
        ([name, email, message]) => {
          const { container, unmount } = render(<ContactSection />);

          const nameInput = container.querySelector('#contact-name') as HTMLInputElement;
          const emailInput = container.querySelector('#contact-email') as HTMLInputElement;
          const messageInput = container.querySelector('#contact-message') as HTMLTextAreaElement;

          fireEvent.change(nameInput, { target: { value: name } });
          fireEvent.change(emailInput, { target: { value: email } });
          fireEvent.change(messageInput, { target: { value: message } });

          const form = container.querySelector('form') as HTMLFormElement;
          fireEvent.submit(form);

          // Form should still be visible (not in success state)
          expect(container.querySelector('form')).not.toBeNull();

          // All three error messages should appear
          expect(container.querySelector('#contact-name-error')).not.toBeNull();
          expect(container.querySelector('#contact-email-error')).not.toBeNull();
          expect(container.querySelector('#contact-message-error')).not.toBeNull();

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 11: Contact form validates email format
 *
 * For any string in the Email field that does not match a valid email pattern
 * (containing @ with valid local and domain parts), form submission SHALL display
 * an email format validation error adjacent to the Email field.
 *
 * Validates: Requirements 13.5
 */
describe('Feature: portfolio-website, Property 11: Contact form validates email format', () => {
  it('shows email format error for invalid email strings when other fields are valid', () => {
    fc.assert(
      fc.property(
        fc.tuple(nonEmptyStringArbitrary, invalidEmailArbitrary, nonEmptyStringArbitrary),
        ([name, email, message]) => {
          const { container, unmount } = render(<ContactSection />);

          const nameInput = container.querySelector('#contact-name') as HTMLInputElement;
          const emailInput = container.querySelector('#contact-email') as HTMLInputElement;
          const messageInput = container.querySelector('#contact-message') as HTMLTextAreaElement;

          fireEvent.change(nameInput, { target: { value: name } });
          fireEvent.change(emailInput, { target: { value: email } });
          fireEvent.change(messageInput, { target: { value: message } });

          const form = container.querySelector('form') as HTMLFormElement;
          fireEvent.submit(form);

          // Email error should appear
          const emailError = container.querySelector('#contact-email-error');
          expect(emailError).not.toBeNull();

          // The error should be either "Email is required" (if whitespace after trim)
          // or "Please enter a valid email address" (if non-empty but invalid format)
          if (!email.trim()) {
            expect(emailError!.textContent).toBe('Email is required');
          } else {
            expect(emailError!.textContent).toBe('Please enter a valid email address');
          }

          // Form should still be visible (submission prevented)
          expect(container.querySelector('form')).not.toBeNull();

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('does not show email format error for valid email addresses', () => {
    fc.assert(
      fc.property(
        fc.tuple(nonEmptyStringArbitrary, validEmailArbitrary, nonEmptyStringArbitrary),
        ([name, email, message]) => {
          const { container, unmount } = render(<ContactSection />);

          const nameInput = container.querySelector('#contact-name') as HTMLInputElement;
          const emailInput = container.querySelector('#contact-email') as HTMLInputElement;
          const messageInput = container.querySelector('#contact-message') as HTMLTextAreaElement;

          fireEvent.change(nameInput, { target: { value: name } });
          fireEvent.change(emailInput, { target: { value: email } });
          fireEvent.change(messageInput, { target: { value: message } });

          const form = container.querySelector('form') as HTMLFormElement;
          fireEvent.submit(form);

          // No email validation error should appear
          const emailError = container.querySelector('#contact-email-error');
          expect(emailError).toBeNull();

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
