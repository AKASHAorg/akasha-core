import React from 'react';

const ArrowUp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M8 14V2.98175" stroke="#8b9FFF" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 6L8 2L12 6" stroke="#8b9FFF" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ArrowUp;
