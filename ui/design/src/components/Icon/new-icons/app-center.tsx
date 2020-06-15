import React from 'react';

const AppCenter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" {...props}>
    <g fill="none" fillRule="evenodd" stroke="#949EB3" transform="translate(1.194 1.194)">
      <circle cx="15.515" cy="15.515" r="15.515" />
      <g strokeLinecap="round" transform="translate(9.697 9.697)">
        <line x1="5.661" x2="5.661" y2="11.323" />
        <line x1="1.658" x2="9.664" y1="1.658" y2="9.664" transform="rotate(-45 5.661 5.661)" />
      </g>
    </g>
  </svg>
);

export default AppCenter;
