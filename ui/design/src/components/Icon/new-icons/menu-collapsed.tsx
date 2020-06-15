import React from 'react';

const MenuCollapsed = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#132540"
      strokeLinecap="round"
      strokeWidth="1.2"
      transform="translate(1 .5)"
    >
      <line x1="3" x2="11" y1="6.5" y2="6.5" />
      <line x1=".5" x2="13.5" y1="12.5" y2="12.5" />
      <line x1=".5" x2="13.5" y1=".5" y2=".5" />
    </g>
  </svg>
);

export default MenuCollapsed;
