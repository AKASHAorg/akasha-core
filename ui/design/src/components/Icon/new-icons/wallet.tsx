import React from 'react';

const Wallet = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd" strokeWidth="1.5" transform="translate(1 3)">
      <path
        d="M1 3L1 14M14 3L14 6M14 9L14 14M1 3C1 .5 2 .5 2 .5 2 .5 7 .5 17 .5M14 12L17 12M1 3L14 3M1 14L14 14M17 .5L17 12"
        strokeLinecap="round"
      />
      <path d="M16.9499998,8.75 L16.9499998,6.25 L10.6999998,6.25 C10.5619286,6.25 10.4499998,6.36192881 10.4499998,6.5 L10.4499998,8.5 C10.4499998,8.63807119 10.5619286,8.75 10.6999998,8.75 L16.9499998,8.75 Z" />
    </g>
  </svg>
);

export default Wallet;
