export interface ILogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  setLevel(lvl: string): void;
}

interface ILogService {
  create(nameSpace?: string): ILogger;
}

export default ILogService;
