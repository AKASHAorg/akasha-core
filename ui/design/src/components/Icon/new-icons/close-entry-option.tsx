import React from 'react';

const CloseEntryOption = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(1.5 1.5)">
      <circle cx="10.5" cy="10.5" r="10.5" strokeWidth="1.5" />
      <g transform="rotate(45 1.866 13.42)">
        <rect width="1.313" height="10.5" x="5.25" rx=".656" />
        <rect
          width="1.313"
          height="10.5"
          x="5.156"
          y=".094"
          transform="rotate(90 5.906 5.344)"
          rx=".656"
        />
      </g>
    </g>
  </svg>
);

export default CloseEntryOption;
