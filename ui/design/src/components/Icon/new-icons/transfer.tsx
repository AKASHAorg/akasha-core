import React from 'react';

const Transfer = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(-1238 -2714)">
      <g stroke="#132540" strokeLinecap="round" transform="translate(1238 2714)">
        <g transform="translate(3.5 2.5)">
          <path d="M10.4583333,0 L12.6566092,2.5" />
          <path d="M10.4583333,2.5 L12.6566092,5" transform="matrix(1 0 0 -1 0 7.5)" />
          <path
            strokeLinejoin="round"
            d="M11.5574713,2.5 L2.54166667,2.5 C0.951628352,2.74472718 0.187739464,4.05590897 0.25,6.43354538"
          />
        </g>
        <g transform="rotate(180 8.25 8.75)">
          <path d="M10.4583333,0 L12.6566092,2.5" />
          <path d="M10.4583333,2.5 L12.6566092,5" transform="matrix(1 0 0 -1 0 7.5)" />
          <path
            strokeLinejoin="round"
            d="M11.5574713,2.5 L2.54166667,2.5 C0.951628352,2.74472718 0.187739464,4.05590897 0.25,6.43354538"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default Transfer;
