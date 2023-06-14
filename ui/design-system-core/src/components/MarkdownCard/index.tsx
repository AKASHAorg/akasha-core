import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Spinner from '../Spinner/index';
import BasicCardBox from '../BasicCardBox';
import { tw } from '@twind/core';

export interface IMarkdownCard {
  mdText: string | null;
  hasWrapper?: boolean;
}

const MarkdownCard: React.FC<IMarkdownCard> = props => {
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
