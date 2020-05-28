import React from 'react';

const AppFeed = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    {...props}
  >
    <defs>
      <polygon id="homefeed-app-icon-a" points="0 .002 6.173 3.465 6.173 8.295" />
      <polygon id="homefeed-app-icon-b" points="0 .002 6.173 3.465 6.173 8.295" />
      <polygon id="homefeed-app-icon-c" points=".012 0 .012 13.273 6.243 9.814" />
      <polygon id="homefeed-app-icon-d" points=".012 0 .012 13.273 6.243 9.814" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <rect width="32" height="32" fill="#FDEEEE" rx="16" />
      <g transform="translate(5.6 5.6)">
        <rect width="20" height="20" />
        <g transform="translate(4)">
          <use fill="#6E6EFA" transform="translate(.07 10.921)" xlinkHref="#homefeed-app-icon-a" />
          <use
            fill="#2926D7"
            transform="matrix(-1 0 0 1 12.416 10.921)"
            xlinkHref="#homefeed-app-icon-b"
          />
          <use
            fill="#EE8C8A"
            transform="matrix(-1 0 0 1 6.254 0)"
            xlinkHref="#homefeed-app-icon-c"
          />
          <use fill="#413552" transform="translate(6.231)" xlinkHref="#homefeed-app-icon-d" />
        </g>
      </g>
    </g>
  </svg>
);

export default AppFeed;
