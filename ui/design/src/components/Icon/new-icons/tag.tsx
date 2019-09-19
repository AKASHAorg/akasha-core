import React from 'react';

const Tag = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(2 .47)">
      <polygon
        points="6.138 .858 2.633 3.259 2.633 13.372 6.154 11.045 9.724 13.365 9.724 3.256"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(20 6.179 7.115)"
      />
      <path d="M5.5,5.12915349 C5.5,5.88154889 6.14906865,6.49360111 6.94696833,6.49360111 C7.74486801,6.49360111 8.39393667,5.88154889 8.39393667,5.12915349 C8.39393667,4.3767581 7.74486801,3.76470588 6.94696833,3.76470588 C6.14906865,3.76470588 5.5,4.3767581 5.5,5.12915349 Z" />
    </g>
  </svg>
);

export default Tag;
