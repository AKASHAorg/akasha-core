import React from 'react';

const IconGeneralFeed = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="17"
    height="24"
    viewBox="0 0 17 24"
    {...props}
  >
    <defs>
      <polygon id="ethereum.world-logo-a" points="0 .002 7.95 4.327 7.95 10.36" />
      <polygon id="ethereum.world-logo-b" points="0 .002 7.95 4.327 7.95 10.36" />
      <polygon id="ethereum.world-logo-c" points=".015 0 .015 16.578 8.04 12.257" />
      <polygon id="ethereum.world-logo-d" points=".015 0 .015 16.578 8.04 12.257" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <use fill="#6E6EFA" transform="translate(.09 13.64)" xlinkHref="#ethereum.world-logo-a" />
      <use
        fill="#2926D7"
        transform="matrix(-1 0 0 1 15.99 13.64)"
        xlinkHref="#ethereum.world-logo-b"
      />
      <use fill="#EE8C8A" transform="matrix(-1 0 0 1 8.055 0)" xlinkHref="#ethereum.world-logo-c" />
      <use fill="#413552" transform="translate(8.025)" xlinkHref="#ethereum.world-logo-d" />
    </g>
  </svg>
);

export default IconGeneralFeed;
