import React from 'react';

const Video = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#4E71FF"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(1 3)"
    >
      <polygon points="16 1.455 10.909 5.091 16 8.727" />
      <rect width="10.909" height="10.182" rx="2" />
    </g>
  </svg>
);

export default Video;
