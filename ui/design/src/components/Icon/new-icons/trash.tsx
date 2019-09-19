import React from 'react';

const Trash = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(2.5 1.5)">
      <path d="M0.5,2 L10.5,2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="1.5 3 1.5 13 9.5 13 9.5 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 5L4 10.5827625M7 5L7 10.5827625" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7,1.5 C7,0.671572875 6.32842712,0 5.5,0 C4.67157288,0 4,0.671572875 4,1.5" />
    </g>
  </svg>
);

export default Trash;
