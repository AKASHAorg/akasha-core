import React from 'react';

const Followers = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(2 1)">
      <circle cx="5.5" cy="3" r="2.5" />
      <path
        d="M5.5,13 L0.5,13 C0.833333333,9 2.5,7 5.5,7 C8.5,7 10.1666667,8.33333333 10.5,11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform="matrix(-1 0 0 1 11.6 11.5)" strokeLinecap="round">
        <path d="M3.1,0 L4.6,1.5" />
        <path d="M3.1,1.5 L4.6,3" transform="matrix(1 0 0 -1 0 4.5)" />
        <path d="M1.4566e-12,1.5 L4.6,1.5" />
      </g>
    </g>
  </svg>
);

export default Followers;
