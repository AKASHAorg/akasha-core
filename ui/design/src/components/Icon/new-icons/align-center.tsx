import React from 'react';

const AlignCenter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 6H26V8H6V6ZM10 12H22V14H10V12ZM6 18H26V20H6V18ZM10 24H22V26H10V24Z"
      fill="#212529"
    />
  </svg>
);

export default AlignCenter;
