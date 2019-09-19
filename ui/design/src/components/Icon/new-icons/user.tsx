import React from 'react';

const User = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(1 1)">
      <circle cx="7" cy="7" r="6.5" />
      <circle cx="9.75" cy="4.75" r="1" fill="#2E3747" />
      <circle cx="4.25" cy="4.75" r="1" fill="#2E3747" />
      <path
        d="M4,8 C4,9.65685425 5.34314575,11 7,11 L7,11 C8.65685425,11 10,9.65685425 10,8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default User;
