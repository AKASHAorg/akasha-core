import React from 'react';

const Quote = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(2 2)"
    >
      <rect width="16" height="16" />
      <line x1="3.002" x2="9.25" y1="4.25" y2="4.25" />
      <polygon points="3.002 8.625 13 8.625 13 12.375 3.002 12.375" />
    </g>
  </svg>
);

export default Quote;
