import React from 'react';

const Stats = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="rotate(90 7.75 9.25)" strokeLinecap="round">
      <path d="M20,8.5 L6,8.5 L20,8.5 Z" strokeLinejoin="round" transform="rotate(-90 13 9)" />
      <polyline points="9 15 5 10 7.5 7 3.5 4" strokeLinejoin="round" />
      <g transform="rotate(-146 2.57 2.697)">
        <path d="M-8.9e-15,-1.18e-14 L2.10617088,2.10617088" />
        <path
          d="M-7.1e-15,2.10617088 L2.10617088,4.21234177"
          transform="matrix(1 0 0 -1 0 6.319)"
        />
      </g>
    </g>
  </svg>
);

export default Stats;
