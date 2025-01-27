import React from 'react';
import { LucideProps } from 'lucide-react';

export const Ethereum = React.forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
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
    <path d="M12 1 6.4 11.336l5.6 3.876M12 1v14.212M12 1l5.6 10.336-5.6 3.876m-6-.861 6 8.613v-4.737L6 14.35Zm12 0L12.104 23v-4.737L18 14.35Z" />
  </svg>
));
Ethereum.displayName = 'Ethereum';
