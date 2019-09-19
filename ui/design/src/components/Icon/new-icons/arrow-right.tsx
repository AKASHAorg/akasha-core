import React from 'react';

const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(2 3)" strokeLinecap="round">
      <path d="M7,0 L12,5" />
      <path d="M7,5 L12,10" transform="matrix(1 0 0 -1 0 15)" />
      <path d="M0,5 L12,5" />
    </g>
  </svg>
);

export default ArrowRight;
