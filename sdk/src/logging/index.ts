import { injectable } from 'inversify';
import pino from 'pino';
import { validate } from '../common/validator';
import { z } from 'zod';

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
  @validate(z.string().optional())
  create(nameSpace?: string) {
    const logger = this._appLogger.child({ module: nameSpace });
    logger.level = process.env.LOG_LEVEL || 'warn';
    return logger;
  }
}

export default Logging;
