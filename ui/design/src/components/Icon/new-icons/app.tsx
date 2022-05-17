import React from 'react';

const App = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="#425166"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.5001 21C13.6112 21 15.7223 16.7467 15.7223 11.5C15.7223 6.25329 13.6112 2 11.5001 2C9.38894 2 7.27783 6.25329 7.27783 11.5C7.27783 16.7467 9.38894 21 11.5001 21Z"
      stroke="#425166"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 11.5001C2 13.6112 6.2533 15.7223 11.5 15.7223C16.7467 15.7223 21 13.6112 21 11.5001C21 9.38894 16.7467 7.27783 11.5 7.27783C6.2533 7.27783 2 9.38894 2 11.5001Z"
      stroke="#425166"
    />
  </svg>
);

export default App;
