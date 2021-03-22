import React from 'react';

const Email = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g
      fill="none"
      fill-rule="evenodd"
      stroke="#FFF"
      stroke-linecap="round"
      stroke-linejoin="round"
      transform="translate(1.667 3.333)"
    >
      <path d="M1.66666667,0 L15,0 C15.9166667,0 16.6666667,0.75 16.6666667,1.66666667 L16.6666667,11.6666667 C16.6666667,12.5833333 15.9166667,13.3333333 15,13.3333333 L1.66666667,13.3333333 C0.75,13.3333333 0,12.5833333 0,11.6666667 L0,1.66666667 C0,0.75 0.75,0 1.66666667,0 Z" />
      <polyline points="16.667 1.667 8.333 7.5 0 1.667" />
    </g>
  </svg>
);

export default Email;
