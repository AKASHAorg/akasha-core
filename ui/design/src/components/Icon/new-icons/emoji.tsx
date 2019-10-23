import React from 'react';

const Emoji = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(-698 -2710)">
      <g transform="translate(700.5 2712.5)">
        <circle cx="7.5" cy="7.5" r="7.5" stroke="#949EB3" />
        <path
          stroke="#949EB3"
          strokeLinecap="round"
          d="M4.0534945,8.78108476 C4.25622592,9.26999218 4.5531274,9.70998165 4.92157288,10.0784271 C5.6454305,10.8022847 6.6454305,11.25 7.75,11.25 L7.75,11.25 C8.8545695,11.25 9.8545695,10.8022847 10.5784271,10.0784271 C10.9468726,9.70998165 11.2437741,9.26999218 11.4465055,8.78108476"
        />
        <circle cx="4.75" cy="5.25" r="1" fill="#949EB3" />
        <circle cx="10.75" cy="5.25" r="1" fill="#949EB3" />
      </g>
    </g>
  </svg>
);

export default Emoji;
