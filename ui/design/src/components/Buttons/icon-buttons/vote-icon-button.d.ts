export interface IVoteIconProps {
  className?: string;
  voteType: 'upvote' | 'downvote';
  voteCount: number | string;
  onClick: any;
  voted?: boolean;
}
declare const VoteIconButton: (props: IVoteIconProps) => JSX.Element;
export default VoteIconButton;
