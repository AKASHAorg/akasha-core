import React from 'react';

const Close = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      transform="rotate(45 5 5)"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M.757359313 5L9.24264069 5M5 .757359313L5 9.24264069" />
    </g>
  </svg>
);

export default Close;
