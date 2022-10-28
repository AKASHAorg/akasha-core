export { Logger } from 'pino';
import { Logger } from 'pino';
export type ILogger = Logger;

interface ILogService {
  create(nameSpace?: string): Logger;
}

export default ILogService;
