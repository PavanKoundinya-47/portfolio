'use client';

import { useState, useCallback } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';

const NAV_ITEMS = [
  { label: 'Mission Brief', href: '#mission-brief' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Mission Log', href: '#mission-log' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.href.slice(1));

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSection = useScrollSpy(SECTION_IDS);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.slice(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsMobileMenuOpen((prev) => !prev);
      }
    },
    []
  );

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-transparent"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            className="text-xl font-bold text-space-accent tracking-wider"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            PK
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const sectionId = item.href.slice(1);
              const isActive = activeSection === sectionId;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-space-accent bg-space-accent/10'
                        : 'text-space-muted hover:text-space-text hover:bg-space-surface/50'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded-md text-space-muted hover:text-space-text hover:bg-space-surface/50 focus:outline-none focus:ring-2 focus:ring-space-accent"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            onKeyDown={handleKeyDown}
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="px-4 pb-4 space-y-1 bg-space-bg/95 backdrop-blur-md border-t border-space-surface/50">
          {NAV_ITEMS.map((item) => {
            const sectionId = item.href.slice(1);
            const isActive = activeSection === sectionId;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`block px-3 py-3 min-h-[44px] flex items-center rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-space-accent bg-space-accent/10'
                      : 'text-space-muted hover:text-space-text hover:bg-space-surface/50'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
