import { ObservableCallResult } from './basic';

export interface ILogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  setLevel(lvl: string): void;
}

export default interface ILogService {
  create(nameSpace?: string): ObservableCallResult<ILogger>;
}
