'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { useViewportAnimation } from '../hooks/useViewportAnimation';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required';
  }

  return errors;
}

function GitHubIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const iconMap = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: EmailIcon,
};

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const animation = useViewportAnimation({ direction: 'up' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setFormState('submitting');
    setErrorMessage('');

    try {
      // Try Formspree submission if endpoint is configured
      const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

      if (formspreeEndpoint) {
        const response = await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }),
        });

        if (!response.ok) {
          throw new Error('Form submission failed');
        }
      } else {
        // Mailto fallback
        const subject = encodeURIComponent(
          `Portfolio Contact from ${formData.name}`
        );
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );
        const emailLink = profile.socialLinks.find(
          (link) => link.platform === 'email'
        );
        const emailAddress = emailLink
          ? emailLink.url.replace('mailto:', '')
          : '';
        window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
      }

      setFormState('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setFormState('error');
      setErrorMessage(
        'Something went wrong. Please try again or use the email link below.'
      );
    }
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 relative z-10"
      aria-label="Contact"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={animation.ref as React.RefObject<HTMLDivElement>}
          initial={animation.initial}
          animate={animation.animate}
          transition={animation.transition as import('framer-motion').Transition}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-space-text text-center mb-12">
            Contact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-space-surface border border-space-accent/20 rounded-lg p-6">
              {formState === 'success' ? (
                <div
                  className="text-center py-8"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-space-success text-lg font-semibold mb-2">
                    Message sent successfully!
                  </p>
                  <p className="text-space-muted text-sm">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormState('idle')}
                    className="mt-4 px-4 py-2 min-h-[44px] text-sm text-space-accent border border-space-accent/30 rounded-lg hover:bg-space-accent/10 transition-colors duration-200"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Error banner */}
                  {formState === 'error' && errorMessage && (
                    <div
                      className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                      role="alert"
                      aria-live="assertive"
                    >
                      {errorMessage}
                    </div>
                  )}

                  {/* Name field */}
                  <div className="mb-4">
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-space-text mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={100}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name ? 'contact-name-error' : undefined
                      }
                      className="w-full px-4 py-2 bg-space-bg border border-space-accent/20 rounded-lg text-space-text placeholder-space-muted/50 focus:outline-none focus:ring-2 focus:ring-space-accent focus:border-transparent transition-colors duration-200"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p
                        id="contact-name-error"
                        className="mt-1 text-sm text-red-400"
                        role="alert"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="mb-4">
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-space-text mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      maxLength={254}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? 'contact-email-error' : undefined
                      }
                      className="w-full px-4 py-2 bg-space-bg border border-space-accent/20 rounded-lg text-space-text placeholder-space-muted/50 focus:outline-none focus:ring-2 focus:ring-space-accent focus:border-transparent transition-colors duration-200"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p
                        id="contact-email-error"
                        className="mt-1 text-sm text-red-400"
                        role="alert"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message field */}
                  <div className="mb-6">
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-space-text mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      maxLength={2000}
                      rows={5}
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? 'contact-message-error' : undefined
                      }
                      className="w-full px-4 py-2 bg-space-bg border border-space-accent/20 rounded-lg text-space-text placeholder-space-muted/50 focus:outline-none focus:ring-2 focus:ring-space-accent focus:border-transparent transition-colors duration-200 resize-y"
                      placeholder="Your message..."
                    />
                    {errors.message && (
                      <p
                        id="contact-message-error"
                        className="mt-1 text-sm text-red-400"
                        role="alert"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="w-full px-6 py-3 bg-space-accent text-white font-semibold rounded-lg hover:bg-space-accent/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    {formState === 'submitting'
                      ? 'Sending...'
                      : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Social Links */}
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-space-text mb-6">
                Connect with me
              </h3>
              <p className="text-space-muted mb-8">
                Feel free to reach out through the form or connect with me on
                social platforms.
              </p>
              <div className="flex flex-col gap-4">
                {profile.socialLinks.map((link) => {
                  const Icon = iconMap[link.platform];
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex items-center gap-3 text-space-muted hover:text-space-accent transition-colors duration-200 min-h-[44px] group"
                    >
                      <span className="flex items-center justify-center w-11 h-11 bg-space-surface border border-space-accent/20 rounded-lg group-hover:border-space-accent/50 transition-colors duration-200">
                        <Icon />
                      </span>
                      <span className="text-sm capitalize">
                        {link.platform === 'email' ? 'Email' : link.platform === 'github' ? 'GitHub' : 'LinkedIn'}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
