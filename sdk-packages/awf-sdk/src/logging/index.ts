import { injectable, inject } from 'inversify';
import ILogService, { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces/basic';
import { defer } from 'rxjs';
import pino from 'pino';

@injectable()
class Logging implements ILogService {
  private _appLogger;
  public constructor() {
    this._appLogger = pino({ browser: { asObject: true } });
  }
  create(nameSpace?: string): ObservableCallResult<ILogger> {
    const log = this._appLogger.child({ module: nameSpace });
    // return defer(() => from([log]));
    return undefined;
  }
}

export { Logging };
