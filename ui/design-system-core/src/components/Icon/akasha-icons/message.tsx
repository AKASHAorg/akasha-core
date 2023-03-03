import React from 'react';

const Message = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="18"
    viewBox="0 0 22 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20.75 3.75V14.25C20.75 15.4926 19.7426 16.5 18.5 16.5H3.5C2.25736 16.5 1.25 15.4926 1.25 14.25V3.75M20.75 3.75C20.75 2.50736 19.7426 1.5 18.5 1.5H3.5C2.25736 1.5 1.25 2.50736 1.25 3.75M20.75 3.75V3.99271C20.75 4.77405 20.3447 5.49945 19.6792 5.90894L12.1792 10.5243C11.4561 10.9694 10.5439 10.9694 9.82078 10.5243L2.32078 5.90894C1.65535 5.49945 1.25 4.77405 1.25 3.99271V3.75"
      stroke="#7222D2"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Message;
