import * as React from 'react';
export interface IProgressNode {
  state: NodeState;
}
export declare type NodeState = 0 | 1 | 2 | 3;
declare const ProgressNode: React.FC<IProgressNode>;
export { ProgressNode };
