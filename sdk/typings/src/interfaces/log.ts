import { ServiceCallResult } from './responses';

export interface ILogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  setLevel(lvl: string): void;
}

export default interface ILogService {
  create(nameSpace?: string): ServiceCallResult<ILogger>;
}
