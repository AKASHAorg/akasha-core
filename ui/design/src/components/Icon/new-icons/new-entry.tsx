import React from 'react';

const NewEntry = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <g fill="none" fillRule="evenodd" strokeWidth="1.5" transform="translate(1 1)">
      <path
        d="M9,-1 L13,-1 L13,-1 C13.5522847,-1 14,-0.55228475 14,-3.33066907e-16 L14,18.5652174 L11,24 L8,18.5652174 L8,0 L8,0 C8,-0.55228475 8.44771525,-1 9,-1 Z"
        transform="rotate(45 11 11.5)"
      />
      <path d="M15,3 L19,7" />
    </g>
  </svg>
);

export default NewEntry;
