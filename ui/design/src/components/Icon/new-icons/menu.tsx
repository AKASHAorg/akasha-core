import React from 'react';

const Menu = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd">
      <g stroke="#FF5050" opacity="0">
        <rect width="19" height="19" x=".5" y=".5" opacity=".2" />
        <rect width="15.667" height="19" x="2.167" y=".5" opacity=".2" />
        <rect
          width="15.667"
          height="19"
          x="2.167"
          y=".5"
          opacity=".2"
          transform="rotate(90 10 10)"
        />
      </g>
      <g fill="#132540" transform="translate(2 4)">
        <rect width="16" height="1" rx=".5" />
        <rect width="16" height="1" y="5.5" rx=".5" />
        <rect width="16" height="1" y="11" rx=".5" />
      </g>
    </g>
  </svg>
);

export default Menu;
