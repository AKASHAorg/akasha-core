import React from 'react';

const Image = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(-1398 -2686)">
      <rect width="1440" height="4112" fill="#FBFCFD" />
      <g
        stroke="#132540"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(1400 2688)"
      >
        <rect width="16" height="16" rx="2" />
        <circle cx="4.889" cy="4.889" r="1.333" />
        <polyline points="16 10.667 11.556 6.222 1.778 16" />
      </g>
    </g>
  </svg>
);

export default Image;
