import React from 'react';

const Bold = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <path
      fill="none"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M0,0.5 L3.39592108,0.5 C4.83411415,0.5 6,1.66588585 6,3.10407892 L6,3.10407892 L6,3.10407892 C6,4.542272 4.83411415,5.70815784 3.39592108,5.70815784 L0,5.70815784 L0,5.70815784 L4.10657898,5.70815784 C5.70457128,5.70815784 7,7.00358656 7,8.60157886 C7,10.1995712 5.70457128,11.4949999 4.10657898,11.4949999 L0,11.4949999 L0,11.4949999 L0,0.5 Z"
      transform="translate(7 4)"
    />
  </svg>
);

export default Bold;
