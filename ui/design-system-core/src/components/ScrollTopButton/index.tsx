import * as React from 'react';

import Icon from '../Icon';
import Button from '../Button';
import ReactMarkdown from 'react-markdown';
import children = ReactMarkdown.propTypes.children;
import Text from '../Text';

export type ScrollTopButtonProps = {
  onClick: () => void;
  hide?: boolean;
};

const ScrollTopButton = React.forwardRef<HTMLDivElement, ScrollTopButtonProps>(
  ({ onClick, hide }, ref) => {
    const styledDiv = `flex items-center justify-center w-12 h-12 rounded-3xl bg-grey5 cursor-pointer hover:(bg-grey4 [&>*]:stroke-[#fff])`;

    return (
      !hide && (
        <Button
          title="scroll-to-top"
          plain={true}
          onClick={() => onClick()}
          customStyle={styledDiv}
        >
          <div ref={ref}>
            <Icon type="ArrowUpIcon" hover={true} accentColor={true} />
          </div>
        </Button>
      )
    );
  },
);

export default ScrollTopButton;
