import React from 'react';

const Block = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#FF5C5C"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(2 2)"
    >
      <circle cx="6" cy="6" r="6" />
      <line x1="6" x2="6" y2="12" transform="rotate(-45 6 6)" />
    </g>
  </svg>
);

export default Block;
