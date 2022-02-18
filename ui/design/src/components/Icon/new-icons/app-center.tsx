import React from 'react';

const AppCenter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="3.5" y="3.5" width="7.1" height="7.1" rx="1.5" stroke="#132540" />
    <rect x="13.3999" y="13.4004" width="7.1" height="7.1" rx="1.5" stroke="#132540" />
    <rect x="3.5" y="13.4004" width="7.1" height="7.1" rx="1.5" stroke="#132540" />
    <path
      d="M16.9498 4.0127V10.0878"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.9873 7.05059L13.9123 7.05059"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AppCenter;
