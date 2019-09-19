import React from 'react';

const Import = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="rotate(90 6.75 8.25)" strokeLinecap="round">
      <polyline
        points="17 3.5 17 10.5 3 10.5 3 3.5"
        strokeLinejoin="round"
        transform="rotate(-90 10 7)"
      />
      <path d="M5,3 L9,7" />
      <path d="M5,7 L9,11" transform="matrix(1 0 0 -1 0 18)" />
      <path d="M0,7 L9,7" />
    </g>
  </svg>
);

export default Import;
