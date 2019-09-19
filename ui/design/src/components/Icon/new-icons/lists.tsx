import React from 'react';

const Lists = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      transform="translate(1)"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 1 8 1 8 9 0 9 0 1 .5 1" />
      <polygon points="2 4.992 2 .5 4.433 .5 4.433 4.994 3.216 3.875" />
    </g>
  </svg>
);

export default Lists;
