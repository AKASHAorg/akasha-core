import React from 'react';

const GethGreen = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <g fill="none" fillRule="evenodd">
      <circle cx="12" cy="12" r="11.5" stroke="#73BF78" />
      <g transform="translate(7 4)">
        <path
          stroke="#B4BCC8"
          d="M4.70588235,0.91390645 L0.659717096,7.10453929 L4.70588235,10.5437798 L8.75204761,7.10453929 L4.70588235,0.91390645 Z"
        />
        <polygon
          fill="#B4BCC8"
          points="4.706 8 9.412 16 4.706 12 0 16"
          transform="matrix(1 0 0 -1 0 24)"
        />
      </g>
    </g>
  </svg>
);

export default GethGreen;
