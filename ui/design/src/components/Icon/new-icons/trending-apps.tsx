import React from 'react';

const TrendingApps = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(-986 -2710)">
      <g transform="translate(986 2710)">
        <circle cx="10" cy="10" r="7.5" stroke="#132540" />
        <path
          stroke="#132540"
          d="M10,17.5 C11.6666667,17.5 13.3333333,14.1421356 13.3333333,10 C13.3333333,5.85786438 11.6666667,2.5 10,2.5 C8.33333333,2.5 6.66666667,5.85786438 6.66666667,10 C6.66666667,14.1421356 8.33333333,17.5 10,17.5 Z"
        />
        <path
          stroke="#132540"
          d="M10,17.5 C11.6666667,17.5 13.3333333,14.1421356 13.3333333,10 C13.3333333,5.85786438 11.6666667,2.5 10,2.5 C8.33333333,2.5 6.66666667,5.85786438 6.66666667,10 C6.66666667,14.1421356 8.33333333,17.5 10,17.5 Z"
          transform="rotate(90 10 10)"
        />
      </g>
    </g>
  </svg>
);

export default TrendingApps;
