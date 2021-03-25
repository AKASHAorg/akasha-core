import React from 'react';

const Legal = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(.5 -1)">
      <polyline
        stroke="#2E3747"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="15 10 15 17.5 0 17.5 0 2.5 6.25 2.5"
      />
      <line
        x1="2.5"
        x2="10.5"
        y1="15"
        y2="15"
        stroke="#132540"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g stroke="#2E3747" transform="rotate(45 6.16 16.39)">
        <path d="M1.82905845,0.905330086 L3.07905845,0.905330086 C3.76941439,0.905330086 4.32905845,1.46497415 4.32905845,2.15533009 L4.32905845,11.8446699 L4.32905845,11.8446699 L2.66605803,14.5054706 C2.59288045,14.6225547 2.43864285,14.658148 2.32155872,14.5849704 C2.28936644,14.5648503 2.26217905,14.5376629 2.24205888,14.5054706 L0.579058454,11.8446699 L0.579058454,11.8446699 L0.579058454,2.15533009 C0.579058454,1.46497415 1.13870252,0.905330086 1.82905845,0.905330086 Z" />
        <line x1=".954" x2="3.954" y1="4.358" y2="4.358" strokeLinecap="square" />
      </g>
    </g>
  </svg>
);

export default Legal;
