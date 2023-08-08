import * as React from 'react';
import { tw } from '@twind/core';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

import BasicCardBox from '../BasicCardBox';
import Spinner from '../Spinner';

export type MarkdownCardProps = {
  mdText: string | null;
  hasWrapper?: boolean;
};

const MarkdownCard: React.FC<MarkdownCardProps> = props => {
  const { mdText, hasWrapper = true } = props;
  const renderContent = () => (
    <>
      {!mdText && <Spinner />}
      {mdText && <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdText}</ReactMarkdown>}
    </>
  );

  const renderWrapper = () => {
    if (!hasWrapper) {
      return <div className={tw(`flex p-4 sm:p-0`)}>{renderContent()}</div>;
    }
    return <BasicCardBox pad="medium">{renderContent()}</BasicCardBox>;
  };
  return <div data-testid="md-card">{renderWrapper()}</div>;
};

export default MarkdownCard;
