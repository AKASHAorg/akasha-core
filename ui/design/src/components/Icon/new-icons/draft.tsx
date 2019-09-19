import React from 'react';

const Draft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(2 1)">
      <rect
        width="11"
        height="13"
        x=".5"
        y=".5"
        stroke="#2E3747"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path stroke="#2E3747" d="M9 3L9 .5M6 3L6 .5M3 3L3 .5" strokeLinecap="square" />
      <circle cx="9" cy="3" r="1" fill="#2E3747" />
      <circle cx="6" cy="3" r="1" fill="#2E3747" />
      <circle cx="3" cy="3" r="1" fill="#2E3747" />
    </g>
  </svg>
);

export default Draft;
