import React from 'react';

const Shield = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 6.49983V9.62483M9 1.26172C7.20792 2.9589 4.78802 3.99984 2.125 3.99984C2.08269 3.99984 2.04043 3.99958 1.99825 3.99906C1.67491 4.98248 1.5 6.03325 1.5 7.12488C1.5 11.7845 4.68693 15.6997 9 16.8098C13.3131 15.6997 16.5 11.7845 16.5 7.12488C16.5 6.03325 16.3251 4.98248 16.0018 3.99906C15.9596 3.99958 15.9173 3.99984 15.875 3.99984C13.212 3.99984 10.7921 2.9589 9 1.26172ZM9 12.1248H9.00625V12.1311H9V12.1248Z"
      stroke="#7222D2"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Shield;
