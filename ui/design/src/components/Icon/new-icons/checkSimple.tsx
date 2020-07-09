import React from 'react';

const CheckSimple = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" {...props}>
    <polyline
      fill="none"
      stroke="#FFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      points="6.4 .64 1.6 5.445 .16 4.005"
      transform="translate(1 1)"
    />
  </svg>
);

export default CheckSimple;
