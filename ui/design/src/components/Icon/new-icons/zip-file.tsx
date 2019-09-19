import React from 'react';

const ZipFile = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(3 1)">
      <polygon points="6 0 11 5 6 5" strokeLinejoin="round" />
      <polygon
        points="0 14.059 0 0 6 0 6 5 11 5 11 14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="#2E3747" transform="translate(2 .5)">
        <polygon points="0 6 1 6 1 7 0 7" />
        <polygon points="1 6 1 5 2 5 2 6" />
        <polygon points="1 4 1 3 2 3 2 4" />
        <polygon points="0 4 1 4 1 5 0 5" />
        <polygon points="0 2 1 2 1 3 0 3" />
        <polygon points="1 2 1 1 2 1 2 2" />
        <polygon points="0 0 1 0 1 1 0 1" />
        <path d="M1.873,9.474 C1.717,9.759 1.432,9.951 1.111,9.986 L0.999,10 C0.448,10 0,9.551 0,9 C0,8.449 0.449,8 1,8 C1.551,8 2,8.449 2,9 C2,9.159 1.957,9.319 1.873,9.474 L1.873,9.474 Z" />
      </g>
    </g>
  </svg>
);

export default ZipFile;
