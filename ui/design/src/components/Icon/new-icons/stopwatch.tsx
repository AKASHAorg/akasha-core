import React from 'react';

const Stopwatch = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <g fill="none" fillRule="evenodd" transform="translate(-920 -2714)">
      <g stroke="#2E3747" transform="translate(922.5 2715)">
        <circle cx="7.5" cy="10" r="7" />
        <polyline strokeLinecap="round" strokeLinejoin="round" points="7.5 7 7.5 10 10.5 10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5,0.5 L6,0.5" />
      </g>
    </g>
  </svg>
);

export default Stopwatch;
