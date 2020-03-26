import React from 'react';

const Loading = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#949EB3"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(1 1)"
    >
      <line x1="7" x2="7" y2="2.8" />
      <line x1="7" x2="7" y1="11.2" y2="14" />
      <line x1="2.051" x2="4.032" y1="2.051" y2="4.032" />
      <line x1="9.968" x2="11.949" y1="9.968" y2="11.949" />
      <line x2="2.8" y1="7" y2="7" />
      <line x1="11.2" x2="14" y1="7" y2="7" />
      <line x1="2.051" x2="4.032" y1="11.949" y2="9.968" />
      <line x1="9.968" x2="11.949" y1="4.032" y2="2.051" />
    </g>
  </svg>
);

export default Loading;
