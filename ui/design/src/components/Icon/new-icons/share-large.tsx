import React from 'react';

const ShareLarge = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(.5 1)">
      <circle cx="11.5" cy="2.5" r="2.5" />
      <circle cx="11.5" cy="11.5" r="2.5" />
      <circle cx="2.5" cy="6.5" r="2.5" />
      <path d="M9 3.5L5 5.5M4.5 8L8.5 11" strokeLinecap="square" />
    </g>
  </svg>
);

export default ShareLarge;
