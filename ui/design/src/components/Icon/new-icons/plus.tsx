import React from 'react';

const Plus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      transform="translate(1 1)"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M.5 4L7.57106781 4M4.03553391.464466094L4.03553391 7.53553391" />
    </g>
  </svg>
);

export default Plus;
