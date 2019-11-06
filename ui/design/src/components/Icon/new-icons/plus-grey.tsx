import React from 'react';

const PlusGrey = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(-890 -2742)">
      <g stroke="#949EB3" transform="translate(893 2745)">
        <circle cx="7" cy="7" r="7" />
        <g strokeLinecap="round" transform="translate(3.5 3.5)">
          <path d="M3.5,0 L3.5,7" />
          <path d="M1.02512627,1.02512627 L5.97487373,5.97487373" transform="rotate(-45 3.5 3.5)" />
        </g>
      </g>
    </g>
  </svg>
);

export default PlusGrey;
