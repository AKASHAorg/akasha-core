import React from 'react';

const Chat = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path
      fill="none"
      strokeWidth="1.5"
      d="M17.4117647,2 L2.58823529,2 C1.71258824,2 1,2.70833821 1,3.57876272 L1,14.1038475 C1,14.974272 1.71258824,15.6826102 2.58823529,15.6826102 L3.11764706,15.6826102 L3.11764706,20 L8.08141176,15.6826102 L17.4117647,15.6826102 C18.2874118,15.6826102 19,14.974272 19,14.1038475 L19,3.57876272 C19,2.70833821 18.2874118,2 17.4117647,2 Z"
      transform="translate(2 2)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Chat;
