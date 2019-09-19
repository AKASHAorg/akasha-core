import React from 'react';

const OpenEntryOptions = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <g fill="none" fillRule="evenodd">
      <circle cx="12" cy="12" r="10.08" strokeWidth="1.5" />
      <g fill="#2E3747" transform="rotate(90 5.35 11.824)">
        <rect width="1.26" height="10.08" x="5.04" rx=".63" />
        <rect
          width="1.26"
          height="10.08"
          x="4.95"
          y=".09"
          transform="rotate(90 5.67 5.13)"
          rx=".63"
        />
      </g>
    </g>
  </svg>
);

export default OpenEntryOptions;
