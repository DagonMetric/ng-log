// tslint:disable:no-any
// tslint:disable:no-unsafe-any

import { LogLevel } from './log-level';
import { Logger } from './logger';
import { LoggerInformation } from './logger-information';

export class DefaultLogger implements Logger {
    private _loggers: LoggerInformation[];

    get loggers(): LoggerInformation[] {
        return this._loggers;
    }
    set loggers(value: LoggerInformation[]) {
        this._loggers = value;
    }

    log(logLevel: LogLevel, message?: string | Error, ...optionalParams: any[]): void {
        if (!this.loggers) {
            return;
        }

        this.loggers
            .filter(loggerInfo => this.isEnabledInternal(logLevel, loggerInfo))
            .forEach(loggerInfo => {
                loggerInfo.logger.log(logLevel, message, ...optionalParams);
            });
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

    isEnabled(level: LogLevel): boolean {
        if (!this.loggers) {
            return false;
        }

        for (const loggerInfo of this.loggers) {
            if (this.isEnabledInternal(level, loggerInfo)) {
                return true;
            }
        }

        return false;
    }

    private isEnabledInternal(level: LogLevel, loggerInfo: LoggerInformation): boolean {
        // tslint:disable-next-line:no-null-keyword
        if (loggerInfo.minLevel != null &&
            level < loggerInfo.minLevel) {
            return false;
        }

        if (!loggerInfo.logger.isEnabled(level)) {
            return false;
        }

        if (loggerInfo.filter) {
            return loggerInfo.filter(loggerInfo.providerType, loggerInfo.category, level);
        }

        return true;
    }
}
