import React from 'react';

const Calendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(-982 -2714)">
      <g
        stroke="#132540"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(984 2715.667)"
      >
        <rect width="16" height="15" y="1.175" rx="3" />
        <path d="M4 2.12807549e-12L4 2.01754386M12-1.21236354e-13L12 2.01754386M0 5.80701754L16 5.80701754M8.42105263 9.59649123L9.26315789 9.59649123M10.9473684 9.59649123L11.7894737 9.59649123M8.42105263 12.122807L9.26315789 12.122807M5.89473684 12.122807L6.73684211 12.122807M3.36842105 12.122807L4.21052632 12.122807M5.89473684 9.59649123L6.73684211 9.59649123" />
      </g>
    </g>
  </svg>
);

export default Calendar;
