export type ValueOf<T> = T[keyof T];

export interface IAction<P, T> {
  payload: P;
  type: T;
}

export type IBaseSuspenseAction<P> = (payload?: P) => { error: Error | null };

export type UseValueType<P, S, A> = (props: P) => [S, A];
