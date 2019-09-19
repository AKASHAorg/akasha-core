import React from 'react';

const Forward = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      strokeWidth="1.5"
      transform="translate(7.5 5)"
      strokeLinecap="round"
    >
      <path d="M0,0 L5,5" />
      <path d="M0,5 L5,10" transform="matrix(1 0 0 -1 0 15)" />
    </g>
  </svg>
);

export default Forward;
