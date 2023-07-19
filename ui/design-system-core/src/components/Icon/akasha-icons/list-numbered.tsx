import React from 'react';

const ListNumbered = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16 22H30V24H16V22ZM16 8H30V10H16V8ZM8 12V4H6V5H4V7H6V12H4V14H10V12H8ZM10 28H4V24C4 23.4696 4.21071 22.9609 4.58579 22.5858C4.96086 22.2107 5.46957 22 6 22H8V20H4V18H8C8.53043 18 9.03914 18.2107 9.41421 18.5858C9.78929 18.9609 10 19.4696 10 20V22C10 22.5304 9.78929 23.0391 9.41421 23.4142C9.03914 23.7893 8.53043 24 8 24H6V26H10V28Z"
      fill="#212529"
    />
  </svg>
);

export default ListNumbered;
