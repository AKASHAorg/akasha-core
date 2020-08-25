import * as React from 'react';

const EthereumIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="64"
    height="64"
    viewBox="0 0 64 64"
    {...props}
  >
    <defs>
      <ellipse id="ethereumworld-a" cx="32" cy="31.822" rx="32" ry="31.822" />
      <polygon id="ethereumworld-c" points="0 .003 12.223 6.578 12.223 15.747" />
      <polygon id="ethereumworld-d" points="0 .003 12.223 6.578 12.223 15.747" />
      <polygon id="ethereumworld-e" points=".023 0 .023 25.198 12.361 18.63" />
      <polygon id="ethereumworld-f" points=".023 0 .023 25.198 12.361 18.63" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="ethereumworld-b" fill="#fff">
        <use xlinkHref="#ethereumworld-a" />
      </mask>
      <use fill="#EDF0F5" xlinkHref="#ethereumworld-a" />
      <g mask="url(#ethereumworld-b)">
        <g transform="translate(13 13)">
          <rect width="38" height="38" />
          <g transform="translate(7)">
            <use fill="#6E6EFA" transform="translate(.138 20.733)" xlinkHref="#ethereumworld-c" />
            <use
              fill="#2926D7"
              transform="matrix(-1 0 0 1 24.584 20.733)"
              xlinkHref="#ethereumworld-d"
            />
            <use
              fill="#EE8C8A"
              transform="matrix(-1 0 0 1 12.384 0)"
              xlinkHref="#ethereumworld-e"
            />
            <use fill="#413552" transform="translate(12.338)" xlinkHref="#ethereumworld-f" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default EthereumIcon;
