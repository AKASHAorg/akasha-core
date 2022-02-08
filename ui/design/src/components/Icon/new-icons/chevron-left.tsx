import React from 'react';

const ChevronLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M14.5 18L9.22414 12" stroke="#132540" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M14.5 6L9.22414 12" stroke="#132540" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export default ChevronLeft;
