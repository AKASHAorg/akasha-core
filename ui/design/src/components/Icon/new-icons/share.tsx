import React from 'react';

const Share = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#132540"
      strokeLinecap="round"
      transform="translate(2 1)"
    >
      <polyline strokeLinejoin="round" points="12 7 12 13 0 13 0 7" />
      <g transform="rotate(-90 5.5 3.5)">
        <line x1="6" x2="9" y1=".833" y2="3.833" />
        <line x1="6" x2="9" y1="3.833" y2="6.833" transform="matrix(1 0 0 -1 0 10.667)" />
        <line x2="8" y1="3.833" y2="3.833" />
      </g>
    </g>
  </svg>
);

export default Share;
