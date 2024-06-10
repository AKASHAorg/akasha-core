import React from 'react';
import { tw } from '@twind/core';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

import Card from '../Card';

export type MarkdownCardProps = {
  mdText: string | null;
  hasWrapper?: boolean;
};

/**
 * A MarkdownCard component is useful for displaying markdown text in your app. It comes
 * in two forms: with and without a nice Card that wraps up your markdown text and this
 * can be specified through props.
 * @param mdText - the markdown text to be displayed
 * @param hasWrapper - boolean (optional) whether to wrap everything in a nice Card or not
 * @example
 * ```tsx
 *     <MarkdownCard mdText={md-doc} />
 * ```
 **/
const MarkdownCard: React.FC<MarkdownCardProps> = props => {
  const { mdText, hasWrapper = true } = props;

  return (
    <div data-testid="md-card">
      {!hasWrapper && (
        <div className={tw(`flex p-4 sm:p-0`)}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdText}</ReactMarkdown>
        </div>
      )}

      {hasWrapper && (
        <Card padding={16} customStyle="text(dark: dark:white)">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{mdText}</ReactMarkdown>
        </Card>
      )}
    </div>
  );
};

export default MarkdownCard;
