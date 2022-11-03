import { injectable } from 'inversify';
import pino from 'pino';

/**
 * @module Logger
 */
@injectable()
class Logging {
  private _appLogger: pino.Logger;
  public constructor() {
    this._appLogger = pino({ browser: { asObject: true }, level: process.env.LOG_LEVEL });
  }

  /**
   *
   * @param nameSpace - Logger name attribute
   * @returns ILogger
   */
  create(nameSpace?: string) {
    const logger = this._appLogger.child({ module: nameSpace });
    logger.level = process.env.LOG_LEVEL || 'warn';
    return logger;
  }
}

export default Logging;
