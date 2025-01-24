import React from 'react';
import { LucideProps } from 'lucide-react';

export const Reddit = React.forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
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
    <path d="M12.5 8c2.648 0 5.028.826 6.675 2.14a2.5 2.5 0 0 1 2.326 4.36c0 3.59-4.03 6.5-9 6.5-4.875 0-8.845-2.8-9-6.294l-1-.206a2.5 2.5 0 0 1 2.326-4.36C6.473 8.827 8.853 8 11.501 8h.999Zm0 0 1-5 6 1m-9 13c.667.333 1.333.5 2 .5 1 0 1.333-.167 2-.5m4-13a1 1 0 1 0 2 0 1 1 0 0 0-2 0ZM10 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm6 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
  </svg>
));
Reddit.displayName = 'Reddit';
