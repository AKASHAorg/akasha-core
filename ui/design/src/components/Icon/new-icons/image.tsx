import React from 'react';

const Image = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="1.6001"
      y="1.6"
      width="12.8"
      height="12.8"
      rx="2"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="5.511"
      cy="5.51111"
      r="1.06667"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.4002 10.1333L10.8447 6.57777L3.02246 14.4"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Image;
