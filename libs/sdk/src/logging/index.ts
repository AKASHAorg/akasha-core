import { inject, injectable } from 'inversify';
import pino from 'pino';
import { validate } from '../common/validator';
import { z } from 'zod';
import AWF_Config from '../common/config';
import { TYPES } from '@akashaorg/typings/lib/sdk';

/**
 * @module Logger
 */
@injectable()
class Logging {
  private _appLogger: pino.Logger;
  private _config: AWF_Config;
  public constructor(@inject(TYPES.Config) config: AWF_Config) {
    this._config = config;
    this._appLogger = pino({
      browser: { asObject: true },
      level: this._config.getOption('log_level'),
    });
  }

  /**
   *
   * @param nameSpace - Logger name attribute
   * @returns ILogger
   */
  @validate(z.string().optional())
  create(nameSpace?: string) {
    const logger = this._appLogger.child({ module: nameSpace });
    logger.level = this._config.getOption('log_level');
    return logger;
  }
}

export default Logging;
