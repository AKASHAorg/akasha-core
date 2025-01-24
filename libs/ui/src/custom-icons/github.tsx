import React from 'react';
import { LucideProps } from 'lucide-react';

export const Github = React.forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    ref={ref}
    {...props}
  >
    <path d="M8.625 21.375s-.75-3 .75-4.5c0 0-3 0-5.25-2.25s-1.5-6.75 0-8.25c-.75-2.25.75-3.75.75-3.75s2.25 0 3.75 1.5c1.5-.75 5.25-.75 6.75 0 1.5-1.5 3.75-1.5 3.75-1.5s1.5 1.5.75 3.75c1.5 1.5 2.25 6 0 8.25s-5.25 2.25-5.25 2.25c1.5 1.5.75 4.5.75 4.5m-7.5-.75c-2.25.75-4.5-.75-5.25-1.5" />
  </svg>
));
Github.displayName = 'Github';
