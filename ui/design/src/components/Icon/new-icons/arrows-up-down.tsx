import React from 'react';

const ArrowsUpDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#2E3747"
      transform="translate(-4 -3)"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline
        points="5.978 11.828 5.978 7.828 9.978 7.828"
        transform="rotate(-135 7.978 9.828)"
      />
      <polyline points="5.978 7.828 5.978 3.828 9.978 3.828" transform="rotate(45 7.978 5.828)" />
    </g>
  </svg>
);

export default ArrowsUpDown;
