import React from 'react';

const Settings = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd" strokeWidth="1.5" transform="translate(2 2)">
      <path
        d="M0 8L9.14285714 8M13.7142857 8L16 8M0 2.28571429L2.28571429 2.28571429M6.85257985 2.28571429L16 2.28571429M0 13.7142857L3.42857143 13.7142857M8 13.7142857L16 13.7142857"
        strokeLinecap="round"
      />
      <circle cx="4.571" cy="2.286" r="2.286" />
      <circle cx="11.429" cy="8" r="2.286" />
      <circle cx="5.714" cy="13.714" r="2.286" />
    </g>
  </svg>
);

export default Settings;
