import React from 'react';

const ArrowUp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#132540"
      strokeLinecap="round"
      strokeWidth="1.2"
      transform="rotate(-90 10.5 4.5)"
    >
      <line x1=".5" x2="5.776" y2="6" />
      <line x1=".5" x2="5.776" y1="6" y2="12" transform="matrix(1 0 0 -1 0 18)" />
    </g>
  </svg>
);

export default ArrowUp;
