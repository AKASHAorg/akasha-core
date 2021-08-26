import React from 'react';

const HashtagGray = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" {...props}>
    <defs>
      <filter id="icons-12x12-hashtag-grey-a">
        <feColorMatrix
          in="SourceGraphic"
          values="0 0 0 0 0.541176 0 0 0 0 0.580392 0 0 0 0 0.650980 0 0 0 1.000000 0"
        />
      </filter>
    </defs>
    <g
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#icons-12x12-hashtag-grey-a)"
    >
      <g transform="translate(.8 .7)">
        <line x2="10.109" y1="3.554" y2="3.554" stroke="#FFF" />
        <line x2="10.109" y1="7.108" y2="7.108" stroke="#FFF" />
        <line x1="3.791" x2="2.527" y2="10.662" stroke="#FFF" />
        <line x1="7.582" x2="6.318" y2="10.662" stroke="#FFF" />
      </g>
    </g>
  </svg>
);

export default HashtagGray;
