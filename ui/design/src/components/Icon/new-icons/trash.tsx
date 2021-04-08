import React from 'react';

const Trash = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke={props.color}
      strokeLinejoin="round"
      transform="translate(1.4)"
    >
      <polygon strokeLinecap="round" points=".686 5.642 10.286 5.642 9.6 14.4 1.371 14.4" />
      <path d="M2.21052632,3.2 L8.76090226,3.2 C9.98174223,3.2 10.9714286,4.18968634 10.9714286,5.41052632 L10.9714286,5.64210526 L10.9714286,5.64210526 L0,5.64210526 L0,5.41052632 C-1.49509777e-16,4.18968634 0.989686342,3.2 2.21052632,3.2 Z" />
      <line x1="4.114" x2="4.114" y1="8.337" y2="11.705" strokeLinecap="round" />
      <line x1="6.857" x2="6.857" y1="8.337" y2="11.705" strokeLinecap="round" />
      <line x1="6.8" x2="4.4" y1="1.2" y2="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export default Trash;
