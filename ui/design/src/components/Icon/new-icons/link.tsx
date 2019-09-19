import React from 'react';

const Link = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="9" viewBox="0 0 10 9" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(1 .5)" strokeLinecap="round">
      <polyline points="3.021 0 0 0 0 8 7.967 8 8 5.444" strokeLinejoin="round" />
      <path d="M7.5,0.5 L3,5" strokeLinejoin="round" />
      <path d="M5 0L8 .8817842e-16M8 3L8 0" />
    </g>
  </svg>
);

export default Link;
