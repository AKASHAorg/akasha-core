import React from 'react';

const SuccessIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 24C4.5 13.2304 13.2304 4.5 24 4.5C34.7696 4.5 43.5 13.2304 43.5 24C43.5 34.7696 34.7696 43.5 24 43.5C13.2304 43.5 4.5 34.7696 4.5 24ZM31.2206 20.3719C31.7021 19.6977 31.546 18.7609 30.8719 18.2794C30.1977 17.7979 29.2609 17.954 28.7794 18.6281L22.3086 27.6873L19.0607 24.4393C18.4749 23.8536 17.5251 23.8536 16.9393 24.4393C16.3536 25.0251 16.3536 25.9749 16.9393 26.5607L21.4393 31.0607C21.7511 31.3724 22.1843 31.5313 22.6237 31.4949C23.0631 31.4585 23.4643 31.2307 23.7206 30.8719L31.2206 20.3719Z"
      fill="currentColor"
    />
  </svg>
);

export default SuccessIcon;
