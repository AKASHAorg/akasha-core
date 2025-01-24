import React from 'react';
import { LucideProps } from 'lucide-react';

export const Telegram = React.forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
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
    <path d="M20.5 5.5 9.5 13v7.5l3.5-3M22 4 3 12l6 1.5 9 7.5 4-17Z" />
  </svg>
));
Telegram.displayName = 'Telegram';
