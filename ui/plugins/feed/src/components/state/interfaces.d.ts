export interface IAction<P, T> {
  payload: P;
  type: T;
}
