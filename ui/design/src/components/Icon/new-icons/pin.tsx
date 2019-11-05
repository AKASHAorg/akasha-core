import React from 'react';

const Pin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(-1014 -2714)">
      <g stroke="#2E3747" strokeLinecap="round" transform="matrix(-1 0 0 1 1029 2716.5)">
        <polyline strokeLinejoin="round" points="2 6 2 2 1 0 9 0 8 2 8 6" />
        <path
          strokeLinejoin="round"
          d="M8,6 C8,7.25 8.5,8.33333333 10,10 L0,10 C1.5,8.33333333 2,7.25 2,6"
        />
        <path d="M5,10 L5,15" />
      </g>
    </g>
  </svg>
);

export default Pin;
