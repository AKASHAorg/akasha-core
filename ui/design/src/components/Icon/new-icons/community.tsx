import React from 'react';

const Community = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <g fill="none" fillRule="evenodd" strokeWidth="1.5" transform="translate(3 3)">
      <circle cx="9" cy="9" r="9" />
      <path d="M9,0.45 C12,1.95 13.5,4.83530761 13.5,9.10592283 C13.5,13.376538 12,16.2618457 9,17.7618457" />
      <path
        d="M4.5,0.45 C7.5,1.95 9,4.83530761 9,9.10592283 C9,13.376538 7.5,16.2618457 4.5,17.7618457"
        transform="matrix(-1 0 0 1 13.5 0)"
      />
      <path
        d="M7.2,1.8 C9.6,3.52938478 10.8,6.52938478 10.8,10.8 C10.8,15.0706152 9.6,18.0706152 7.2,19.8"
        transform="rotate(90 9 10.8)"
      />
      <path
        d="M7.2,-1.8 C9.6,-0.0706152185 10.8,2.92938478 10.8,7.2 C10.8,11.4706152 9.6,14.4706152 7.2,16.2"
        transform="matrix(0 -1 -1 0 16.2 16.2)"
      />
    </g>
  </svg>
);

export default Community;
