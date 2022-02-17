import * as React from 'react';

const ZoomOutAlt = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.25 18.375C15.185 18.375 18.375 15.185 18.375 11.25C18.375 7.31497 15.185 4.125 11.25 4.125C7.31497 4.125 4.125 7.31497 4.125 11.25C4.125 15.185 7.31497 18.375 11.25 18.375Z"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.875 16.875L21.375 21.375M13.875 11.25H8.625H13.875Z"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ZoomOutAlt;
