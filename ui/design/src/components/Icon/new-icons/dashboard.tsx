import React from 'react';

const Dashboard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <g fill="none" fillRule="evenodd" strokeWidth="1.5" transform="translate(2.5 2)">
      <path d="M9.54545455,0 L0,6.95652174" strokeLinecap="round" />
      <path
        d="M9.54545455,0 L19.0909091,6.95652174 L9.54545455,0 Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.94214876 11.3043478L6.94214876 19.1304348M12.1487603 11.3043478L12.1487603 19.1304348" />
      <path
        d="M17.7892562 7.82608696L17.7892562 19.1304348M1.30165289 7.82608696L1.30165289 19.1304348"
        strokeLinecap="round"
      />
      <path d="M0.867768595,19.1304348 L18.2231405,19.1304348" />
      <path d="M6.94214876,11.3043478 L12.1487603,11.3043478" strokeLinecap="round" />
    </g>
  </svg>
);

export default Dashboard;
