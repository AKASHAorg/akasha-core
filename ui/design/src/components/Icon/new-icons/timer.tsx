import React from 'react';

const Timer = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(3 1)">
      <circle cx="5" cy="7.5" r="5" />
      <path d="M3.5,1 L6.5,1" strokeLinecap="round" />
      <path d="M5,1 L5,2.5" strokeLinecap="square" />
      <polyline points="5 5 5 8 8 8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export default Timer;
