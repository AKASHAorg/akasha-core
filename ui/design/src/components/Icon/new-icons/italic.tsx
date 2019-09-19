import React from 'react';

const Italic = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <polygon
      fill="#2E3747"
      points="5.808 .734 1.631 10.266 2.215 10.266 2.215 11 .013 11 .013 10.266 .828 10.266 5.006 .734 4.417 .734 4.417 0 6.619 0 6.619 .734"
      transform="translate(5 2)"
    />
  </svg>
);

export default Italic;
