import React from 'react';
import { LucideProps } from 'lucide-react';

export const Ethereum = React.forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    ref={ref}
    {...props}
  >
    <path d="M11.9999 16.4904V1.6001L5.5 12.606L11.9999 16.4904Z" fill="#FFE644" />
    <path d="M11.9999 1.6001L18.5 12.606L11.9999 16.4904V1.6001Z" fill="#EC7463" />
    <path d="M5.5 13.4421L11.9999 17.3263V22.3507" fill="#009ECB" />
    <path d="M18.5 13.4421L11.9999 17.3263V22.3507" fill="#4D68AE" />
    <path d="M11.9999 8.72216L5.5 12.606L11.9999 16.4904V8.72216Z" fill="#57A759" />
    <path d="M11.9999 8.72216L18.5 12.606L11.9999 16.4904V8.72216Z" fill="#8E5298" />
  </svg>
));
Ethereum.displayName = 'Ethereum';
