import React from 'react';

const Hashtag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g
      fill="none"
      fillRule="evenodd"
      stroke="#949EB3"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(1)"
    >
      <line x2="14.222" y1="5.333" y2="5.333" />
      <line x2="14.222" y1="10.667" y2="10.667" />
      <line x1="5.333" x2="3.556" y2="16" />
      <line x1="10.667" x2="8.889" y2="16" />
    </g>
  </svg>
);

export default Hashtag;
