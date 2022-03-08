import React from 'react';

const Bookmark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="15"
    height="21"
    viewBox="0 0 15 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 1V20.2L7.6 14.7143L14.2 20.1876V1L1 1Z"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Bookmark;
