import React from 'react';

const Following = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(2 1)">
      <circle cx="5.5" cy="3" r="2.5" />
      <path
        d="M5.5,13 L0.5,13 C0.833333333,9 2.5,7 5.5,7 C7.66982344,7 9.14214559,7.6975013 9.91696643,9.0925039 C10.0333382,9.30202189 10.1485703,9.60862672 10.2626627,10.0123184"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g transform="translate(7 11.5)" strokeLinecap="round">
        <path d="M3.1,0 L4.6,1.5" />
        <path d="M3.1,1.5 L4.6,3" transform="matrix(1 0 0 -1 0 4.5)" />
        <path d="M1.4566e-12,1.5 L4.6,1.5" />
      </g>
    </g>
  </svg>
);

export default Following;
