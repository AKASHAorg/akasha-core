import React from 'react';

const Entries = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(1.5 2.133)" strokeLinejoin="round">
      <polygon points="9.975 0 13.125 3.652 9.975 3.652" />
      <polyline
        points="5.25 .857 5.25 0 9.975 0 9.975 3.652 13.125 3.652 13.125 9.739 9.625 9.739"
        strokeLinecap="round"
      />
      <polygon points="4.725 2.435 7.875 6.087 4.725 6.087" />
      <polygon
        points="0 12.174 0 2.435 4.725 2.435 4.725 6.087 7.875 6.087 7.875 12.174"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export default Entries;
