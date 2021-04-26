import * as React from 'react';
import { Box } from 'grommet';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Spinner from '../Spinner/index';
import { BasicCardBox } from '../EntryCard/basic-card-box';
import { isMobileOnly } from 'react-device-detect';

export interface IMdCard {
  mdText: string | null;
}

const MdCard: React.FC<IMdCard> = props => {
  const { mdText } = props;
  const renderContent = () => (
    <>
      {!mdText && <Spinner />}
      {mdText && <ReactMarkdown plugins={[gfm]} children={mdText} />}
    </>
  );
  return (
    <>
      {isMobileOnly ? (
        <Box pad="medium">{renderContent()}</Box>
      ) : (
        <BasicCardBox pad="medium">{renderContent()}</BasicCardBox>
      )}
    </>
  );
};

export default MdCard;
