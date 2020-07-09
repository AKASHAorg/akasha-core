import React from 'react';

const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd">
      <g stroke="#4E71FF" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 4)">
        <line x2="11.018" y1="4" y2="4" />
        <polyline points="8 0 12 4 8 8" />
      </g>
    </g>
  </svg>
);

export default ArrowRight;
