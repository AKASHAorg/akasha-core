import React from 'react';

const Bookmark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <polygon
      fill="none"
      points="0 0 0 14 5 10 10 13.991 10 0"
      transform="translate(3 1)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Bookmark;
