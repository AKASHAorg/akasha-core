import React from 'react';

const Notifications = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(2.4 2)">
      <path d="M4.4 11.2C4.4 11.8627417 4.9372583 12.4 5.6 12.4L5.6 12.4C6.2627417 12.4 6.8 11.8627417 6.8 11.2M9.6 4C9.6 1.790861 7.809139 0 5.6 0 3.390861 0 1.6 1.790861 1.6 4" />
      <polyline points="1.6 4 1.6 8.4 0 10.8" strokeLinecap="round" />
      <polyline points="9.6 4 9.6 8.4 11.2 10.8" strokeLinecap="round" />
      <path d="M0,10.8 L11.2,10.8" strokeLinecap="round" />
    </g>
  </svg>
);

export default Notifications;
