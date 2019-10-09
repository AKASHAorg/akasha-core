import React from 'react';

const App = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(-282 -2710)">
      <g transform="translate(282 2710)">
        <rect width="16" height="16" />
        <circle cx="8" cy="8" r="6" stroke="#8A94A6" />
        <path
          stroke="#8A94A6"
          d="M8,14 C9.33333333,14 10.6666667,11.3137085 10.6666667,8 C10.6666667,4.6862915 9.33333333,2 8,2 C6.66666667,2 5.33333333,4.6862915 5.33333333,8 C5.33333333,11.3137085 6.66666667,14 8,14 Z"
        />
        <path
          stroke="#8A94A6"
          d="M8,14 C9.33333333,14 10.6666667,11.3137085 10.6666667,8 C10.6666667,4.6862915 9.33333333,2 8,2 C6.66666667,2 5.33333333,4.6862915 5.33333333,8 C5.33333333,11.3137085 6.66666667,14 8,14 Z"
          transform="rotate(90 8 8)"
        />
      </g>
    </g>
  </svg>
);

export default App;
