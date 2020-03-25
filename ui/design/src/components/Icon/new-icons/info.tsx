import React from 'react';

const Info = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(1 1)"
    >
      <circle cx="7" cy="7" r="7" />
      <line x1="7" x2="7.007" y1="10.975" y2="6.548" />
      <line x1="7" x2="7.007" y1="4" y2="4" />
    </g>
  </svg>
);

export default Info;
