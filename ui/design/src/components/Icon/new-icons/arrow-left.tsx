import React from 'react';

const ArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M17.5002 10H3.72743" stroke="#4E71FF" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 5L2.5 10L7.5 15" stroke="#4E71FF" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ArrowLeft;
