// tslint:disable:no-any

import { LogLevel } from './log-level';

/**
 * The logger interface
 */
export interface Logger {
    isEnabled(logLevel: LogLevel): boolean;
    log(logLevel: LogLevel, message?: string | Error, ...optionalParams: any[]): void;
    trace(message?: string, ...optionalParams: any[]): void;
    debug(message: string, ...optionalParams: any[]): void;
    info(message: string, ...optionalParams: any[]): void;
    warn(message: string, ...optionalParams: any[]): void;
    error(message: string | Error, ...optionalParams: any[]): void;
}
