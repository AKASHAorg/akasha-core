import React from 'react';

const Article = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="24"
    viewBox="0 0 20 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13 5H15M13 9H15M15 15.5H5M15 19H5M15 12H5M5 5V9H9V5H5ZM3 23H17C17.5304 23 18.0391 22.7893 18.4142 22.4142C18.7893 22.0391 19 21.5304 19 21V3C19 2.46957 18.7893 1.96086 18.4142 1.58579C18.0391 1.21071 17.5304 1 17 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V21C1 21.5304 1.21071 22.0391 1.58579 22.4142C1.96086 22.7893 2.46957 23 3 23Z"
      stroke="#132540"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Article;
