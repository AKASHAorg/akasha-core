import React from 'react';

const Check = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" {...props}>
    <polyline
      fill="none"
      points="0 3 2 6 8 0"
      transform="translate(1 2)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Check;
