import * as React from 'react';

const ZoomOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 16 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <title>Icon</title>
    <g id="View-Image-Full-Size" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Icon" transform="translate(0.000000, -0.000000)" stroke="#FFFFFF">
        <g id="Icon" transform="translate(1.700000, 1.200000)">
          <circle id="Oval" cx="5" cy="5" r="5"></circle>
          <g
            id="Group"
            transform="translate(3.000000, 4.499064)"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="0" y1="0.5" x2="4.04489361" y2="0.5" id="Line"></line>
          </g>
          <path
            d="M11.2344948,7.95976996 L11.0985378,13.0959728 C11.0985378,13.2915949 10.9194517,13.4501779 10.6985378,13.4501779 L9.4985378,13.4501779 C9.2776239,13.4501779 9.0985378,13.2915949 9.0985378,13.0959728 L9.12057605,7.91484656"
            id="Rectangle"
            transform="translate(10.166516, 10.682512) rotate(-45.000000) translate(-10.166516, -10.682512) "
          ></path>
        </g>
      </g>
    </g>
  </svg>
);

export default ZoomOutIcon;
