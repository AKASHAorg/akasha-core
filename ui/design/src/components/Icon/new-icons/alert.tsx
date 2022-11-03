import React from 'react';

const Alert = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="18"
    viewBox="0 0 22 18"
    fill="none"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.42869 1.48421L1.64617 14.4765C1.31965 15.042 1.3177 15.7382 1.64105 16.3055C1.96439 16.8728 2.56446 17.2259 3.21737 17.233H18.7824C19.4353 17.2259 20.0354 16.8728 20.3588 16.3055C20.6821 15.7382 20.6802 15.042 20.3536 14.4765L12.5711 1.48421C12.238 0.935007 11.6422 0.599609 10.9999 0.599609C10.3576 0.599609 9.76183 0.935007 9.42869 1.48421Z"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.9999 6.20703V9.88237"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M11 13.5571H11.0092" stroke="#132540" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Alert;
