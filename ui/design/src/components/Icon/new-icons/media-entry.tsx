import React from 'react';

const MediaEntry = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      transform="translate(.5 2.5)"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6.5 2 6.5 0 2.5 0 2.5 2 .5 2 .5 11 14.5 11 14.5 2" />
      <path d="M10,6.5 C10,7.87833333 8.87833333,9 7.5,9 C6.12166667,9 5,7.87833333 5,6.5 C5,5.12166667 6.12166667,4 7.5,4 C8.87833333,4 10,5.12166667 10,6.5 Z" />
    </g>
  </svg>
);

export default MediaEntry;
