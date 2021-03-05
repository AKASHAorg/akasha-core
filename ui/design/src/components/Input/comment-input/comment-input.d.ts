import React from 'react';
export interface ICommentInput {
  className?: string;
  avatarImg?: string;
  ethAddress: string;
  placeholderLabel: string;
  publishLabel: string;
  onPublish: (inputValue: string, ethAddress: string) => void;
}
declare const CommentInput: React.FC<ICommentInput>;
export default CommentInput;
