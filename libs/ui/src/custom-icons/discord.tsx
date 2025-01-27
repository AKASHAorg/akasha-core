import React from 'react';
import { LucideProps } from 'lucide-react';

export const Discord = React.forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
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
    <path d="M8.5 17.5C8.167 18.833 7.667 20 7 21c-2.667-1-4.667-2.333-6-4 0-4.667 1-8.667 3-12 1.667-1 3.333-1.667 5-2l1 2a8.125 8.125 0 0 1 4 0l1-2c1.667.333 3.333 1 5 2 2 3.333 3 7.333 3 12-1.333 1.667-3.333 3-6 4-.667-1-1.167-2.167-1.5-3.5M7 17c3.333 1.333 6.667 1.333 10 0m-8-5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
  </svg>
));
Discord.displayName = 'Discord';
