import React from 'react';

const NotificationsOn = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <defs>
      <circle id="a" cx="11.5" cy="4" r="3.5" />
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(3 2.5)">
      <path
        stroke="#2E3747"
        strokeWidth="1.5"
        d="M5.5 14C5.5 14.8284271 6.17157288 15.5 7 15.5L7 15.5C7.82842712 15.5 8.5 14.8284271 8.5 14M12 5C12 2.23857625 9.76142375 0 7 0 4.23857625 0 2 2.23857625 2 5"
      />
      <polyline
        stroke="#2E3747"
        strokeWidth="1.5"
        points="2 5 2 10.5 0 13.5"
        strokeLinecap="round"
      />
      <polyline
        stroke="#2E3747"
        strokeWidth="1.5"
        points="12 5 12 10.5 14 13.5"
        strokeLinecap="round"
      />
      <path stroke="#2E3747" strokeWidth="1.5" d="M0,13.5 L14,13.5" strokeLinecap="round" />
      <use fill="#F96A6A" />
      <circle cx="11.5" cy="4" r="4.25" stroke="#FFFFFF" strokeWidth="1.5" />
    </g>
  </svg>
);

export default NotificationsOn;
