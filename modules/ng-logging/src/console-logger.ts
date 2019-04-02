// tslint:disable:no-any
// tslint:disable:no-unsafe-any
// tslint:disable:no-console

import { LogLevel } from './log-level';
import { Logger } from './logger';

export class ConsoleLogger implements Logger {
    private readonly _filter: (category: string, logLevel: LogLevel) => boolean;

    constructor(readonly name: string, filter?: (category: string, logLevel: LogLevel) => boolean) {
        if (filter) {
            this._filter = filter;
        } else {
            this._filter = () => true;
        }
    }

    log(logLevel: LogLevel, message?: string | Error, ...optionalParams: any[]): void {
        if (!this.isEnabled(logLevel)) {
            return;
        }

        switch (logLevel) {
            case LogLevel.Trace: {
                if (typeof console.trace === 'function') {
                    console.trace(message, ...optionalParams);
                } else if (typeof console.debug === 'function') {
                    console.debug(message, ...optionalParams);
                } else {
                    console.log(message, ...optionalParams);
                }
                break;
            }
            case LogLevel.Debug: {
                if (typeof console.debug === 'function') {
                    console.debug(message, ...optionalParams);
                } else {
                    console.log(message, ...optionalParams);
                }
                break;
            }
            case LogLevel.Info: {
                console.info(message, ...optionalParams);
                break;
            }
            case LogLevel.Warn: {
                console.warn(message, ...optionalParams);
                break;
            }
            case LogLevel.Error: {
                console.error(message, ...optionalParams);
                break;
            }
            case LogLevel.Critical: {
                console.error(message, ...optionalParams);
                break;
            }
            default: {
                console.log(message, ...optionalParams);
            }
        }
    }

    trace(message?: string, ...optionalParams: any[]): void {
        this.log(LogLevel.Trace, message, ...optionalParams);
    }

    debug(message: string, ...optionalParams: any[]): void {
        this.log(LogLevel.Debug, message, ...optionalParams);
    }

    info(message: string, ...optionalParams: any[]): void {
        this.log(LogLevel.Info, message, ...optionalParams);
    }

    warn(message: string, ...optionalParams: any[]): void {
        this.log(LogLevel.Warn, message, ...optionalParams);
    }

    error(message: string | Error, ...optionalParams: any[]): void {
        this.log(LogLevel.Error, message, ...optionalParams);
    }

    isEnabled(logLevel: LogLevel): boolean {
        if (logLevel === LogLevel.None) {
            return false;
        }

        return this._filter(this.name, logLevel);
    }
}
