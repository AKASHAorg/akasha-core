import React from 'react';

const Copy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#949EB3"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(1 1)"
    >
      <rect width="7.8" height="7.8" x="4.2" y="4.2" rx="2" />
      <path d="M1.8,7.8 L1.2,7.8 C0.5372583,7.8 0,7.2627417 0,6.6 L0,1.2 C0,0.5372583 0.5372583,0 1.2,0 L6.6,0 C7.2627417,0 7.8,0.5372583 7.8,1.2 L7.8,1.8" />
    </g>
  </svg>
);

export default Copy;
