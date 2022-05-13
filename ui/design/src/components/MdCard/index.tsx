import * as React from 'react';
import { Box } from 'grommet';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import styled from 'styled-components';
import Spinner from '../Spinner/index';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import { isMobileOnly } from 'react-device-detect';

export interface IMdCard {
  mdText: string | null;
  hasWrapper?: boolean;
}

const MdCardWrapper = styled.div`
  h1,
  h2,
  h3 {
    text-transform: capitalize;
    line-height: 1.1;
  }
`;

const MdCard: React.FC<IMdCard> = props => {
  const { mdText, hasWrapper = true } = props;
  const renderContent = () => (
    <>
      {!mdText && <Spinner />}
      {mdText && <ReactMarkdown plugins={[gfm]}>{mdText}</ReactMarkdown>}
    </>
  );

  const renderWrapper = () => {
    if (!hasWrapper) {
      return <Box>{renderContent()}</Box>;
    }
    if (isMobileOnly) {
      return <Box pad="medium">{renderContent()}</Box>;
    }
    return <BasicCardBox pad="medium">{renderContent()}</BasicCardBox>;
  };
  return <MdCardWrapper data-testid="md-card">{renderWrapper()}</MdCardWrapper>;
};

export default MdCard;
