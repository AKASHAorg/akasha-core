import React from 'react';

const Safe = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 440 440"
    {...props}
  >
    <defs>{/* <style>.cls-1{fill:#008c73}</style> */}</defs>
    <path
      className="cls-1"
      d="M220,9.82C103.92,9.82,9.82,103.92,9.82,220S103.92,430.18,220,430.18,430.18,336.08,430.18,220,336.08,9.82,220,9.82ZM373.83,231.47H276.3a59.41,59.41,0,1,1,.45-20.67h97.08a10.34,10.34,0,1,1,0,20.67Z"
    />
  </svg>
);

export default Safe;
