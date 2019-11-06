import React from 'react';

const Report = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(-522 -2710)">
      <g
        stroke="#FF6F6F"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(524 2712)"
      >
        <path d="M11,0 L11,12" />
        <g transform="translate(.5)">
          <polygon points="3.5 0 8.5 0 8.5 5 3.5 5" />
          <polyline points="5.5 5 5.5 7 .5 7 .5 2 3.5 2" />
        </g>
      </g>
    </g>
  </svg>
);

export default Report;
