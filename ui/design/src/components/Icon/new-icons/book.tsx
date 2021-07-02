import React from 'react';

const Book = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M0 0L4.66666667 0C6.38488589 0 7.77777778 1.39289189 7.77777778 3.11111111L7.77777778 14C7.77777778 12.7113356 6.73310886 11.6666667 5.44444444 11.6666667L0 11.6666667 0 0zM15.5555556 0L10.8888889 0C9.17066967 0 7.77777778 1.39289189 7.77777778 3.11111111L7.77777778 14C7.77777778 12.7113356 8.82244669 11.6666667 10.1111111 11.6666667L15.5555556 11.6666667 15.5555556 0z"
        transform="translate(2 3)"
      />
    </g>
  </svg>
);

export default Book;
