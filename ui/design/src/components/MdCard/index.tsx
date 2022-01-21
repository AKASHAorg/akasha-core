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
  const { mdText } = props;
  const renderContent = () => (
    <>
      {!mdText && <Spinner />}
      {mdText && <ReactMarkdown plugins={[gfm]}>{mdText}</ReactMarkdown>}
    </>
  );
  return (
    <MdCardWrapper data-testid="md-card">
      {isMobileOnly ? (
        <Box pad="medium">{renderContent()}</Box>
      ) : (
        <BasicCardBox pad="medium">{renderContent()}</BasicCardBox>
      )}
    </MdCardWrapper>
  );
};

export default MdCard;
