import React from 'react';

const Italic = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props}>
    <text
      fill="#132540"
      fillRule="evenodd"
      fontFamily="GothamRounded-BookItalic, Gotham Rounded"
      fontSize="16"
      fontStyle="italic"
      fontWeight="300"
    >
      <tspan x="7.672" y="15">
        I
      </tspan>
    </text>
  </svg>
);

export default Italic;
