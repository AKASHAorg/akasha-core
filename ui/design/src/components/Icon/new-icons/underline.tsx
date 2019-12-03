import React from 'react';

const Underline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(5.714 4.762)"
    >
      <path d="M7.14285714,0 L7.14285714,7.14285714 C7.14285714,8.98380631 5.65047298,10.4761905 3.80952381,10.4761905 L3.80952381,10.4761905 C1.96857464,10.4761905 0.476190476,8.98380631 0.476190476,7.14285714 L0.476190476,0 L0.476190476,0" />
      <line x1=".833" x2="6.786" y1="13.238" y2="13.238" />
    </g>
  </svg>
);

export default Underline;
