import React from 'react';

const ArrowDropdownClose = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="matrix(0 -1 -1 0 13 10.5)" strokeLinecap="round">
      <path d="M0,0 L5,5" />
      <path d="M0,5 L5,10" transform="matrix(1 0 0 -1 0 15)" />
    </g>
  </svg>
);

export default ArrowDropdownClose;
