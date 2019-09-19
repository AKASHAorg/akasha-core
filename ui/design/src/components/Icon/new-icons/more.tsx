import React from 'react';

const More = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="#2E3747" fillRule="evenodd" transform="translate(12 3)">
      <circle cx="1" cy="1" r="1" />
      <circle cx="1" cy="5" r="1" />
      <circle cx="1" cy="9" r="1" />
    </g>
  </svg>
);

export default More;
