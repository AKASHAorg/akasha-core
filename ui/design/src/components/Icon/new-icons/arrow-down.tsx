import React from 'react';

const ArrowDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M8 2L8 13.0183" stroke="#4E71FF" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10L8 14L4 10" stroke="#4E71FF" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ArrowDown;
