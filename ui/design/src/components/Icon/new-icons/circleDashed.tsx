import React from 'react';

const CircleDashed = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect
      width="24"
      height="24"
      fill="none"
      rx="100"
      ry="100"
      x="2"
      y="2"
      stroke="#949EB3"
      strokeWidth="1"
      strokeDasharray="1 5.8"
      strokeDashoffset="0"
      strokeLinecap="square"
    />
  </svg>
);

export default CircleDashed;
