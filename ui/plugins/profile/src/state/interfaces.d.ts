export type ValueOf<T> = T[keyof T];

export interface IAction<P, T> {
  payload: P;
  type: T;
}

export interface UseValueType<P, S, A, L> {
  (props: P): [S, { [key in keyof typeof A]: (payload: L) => void }];
}
