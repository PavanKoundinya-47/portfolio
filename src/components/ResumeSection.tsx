'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { useViewportAnimation } from '../hooks/useViewportAnimation';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function ResumeSection() {
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);
  const animation = useViewportAnimation({ direction: 'up', duration: 0.4 });

  useEffect(() => {
    fetch(`${basePath}/resume.pdf`, { method: 'HEAD' })
      .then((response) => {
        setPdfAvailable(response.ok);
      })
      .catch(() => {
        setPdfAvailable(false);
      });
  }, []);

  const summary = profile.summary.slice(0, 300);

  return (
    <section
      id="resume"
      className="py-20 px-4 relative z-10"
      aria-label="Resume"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={animation.ref as React.RefObject<HTMLDivElement>}
          initial={animation.initial}
          animate={animation.animate}
          transition={animation.transition}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-space-text text-center mb-12">
            Resume
          </h2>

          <div className="bg-space-surface border border-space-accent/20 rounded-lg p-8 text-center">
            <p className="text-space-muted text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              {summary}
            </p>

            {pdfAvailable === false && (
              <p className="text-space-muted italic" role="alert">
                Resume currently unavailable
              </p>
            )}

            {pdfAvailable !== false && (
              <a
                href={`${basePath}/resume.pdf`}
                download
                aria-label="Download resume PDF"
                className="inline-flex items-center justify-center gap-2 bg-space-accent hover:bg-space-accent/80 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 min-w-[44px] min-h-[44px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download Resume
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
