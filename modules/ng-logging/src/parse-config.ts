// tslint:disable:no-any
// tslint:disable:no-unsafe-any

import { LogLevel } from './log-level';
import { LoggerFilterOptions } from './logger-options';

interface LogLevelSection {
    [key: string]: string | number | null;
}

export function parseConfig(config: { [key: string]: any }): LoggerFilterOptions {
    const options: LoggerFilterOptions = { rules: [], minLevel: undefined };

    // tslint:disable-next-line:triple-equals
    if (config.minLevel != undefined) {
        if (typeof config.minLevel === 'string') {
            options.minLevel = getSwitch(config.minLevel);
        } else if (typeof config.minLevel === 'number') {
            options.minLevel = config.minLevel;
        } else {
            throw new Error(`Invalid logging configuration, minLevel value '${config.minLevel}' is not supported.`);
        }
    }

    if (config.rules) {
        if (!Array.isArray(config.rules)) {
            throw new Error('Invalid logging configuration.');
        }

        return config as LoggerFilterOptions;
    }

    Object.keys(config)
        .forEach(key => {
            if (key === 'minLevel') {
                return;
            }

            const configSection = config[key];
            if (typeof configSection !== 'object') {
                return;
            }

            if (key === 'logLevel') {
                // Load global category defaults
                // tslint:disable-next-line:no-null-keyword
                loadRules(options, configSection, null);
            } else if (configSection.logLevel) {
                const logLevelSection = configSection.logLevel;

                if (typeof logLevelSection !== 'object') {
                    throw new Error('Invalid logging configuration.');
                }

                // Load logger specific rules
                const loggerName = key;
                loadRules(options, logLevelSection, loggerName);
            }
        });

    return options;
}

function loadRules(options: LoggerFilterOptions,
    section: LogLevelSection,
    loggerName: string | null): void {
    Object.keys(section)
        .forEach(key => {
            const category = key === 'default' ? undefined : key;
            let logLevel: LogLevel | null | undefined;
            const value = section[key];
            // tslint:disable-next-line:triple-equals
            if (value != undefined) {
                if (typeof value === 'string') {
                    logLevel = getSwitch(value);
                } else if (typeof value === 'number') {
                    logLevel = value;
                } else {
                    throw new Error(`Invalid logging configuration, logLevel value '${value}' is not supported.`);
                }
            }

            // tslint:disable-next-line:triple-equals
            if (logLevel != undefined) {
                const newRule = { providerName: loggerName, categoryName: category, logLevel: logLevel };
                options.rules.push(newRule);
            }
        });
}

function getSwitch(value: string): LogLevel {
    switch (value) {
        case 'trace':
        case 'Trace':
            return LogLevel.Trace;
        case 'debug':
        case 'Debug':
            return LogLevel.Debug;
        case 'info':
        case 'Info':
            return LogLevel.Info;
        case 'warn':
        case 'Warn':
            return LogLevel.Warn;
        case 'error':
        case 'Error':
            return LogLevel.Error;
        case 'critical':
        case 'Critical':
            return LogLevel.Critical;
        case 'none':
        case 'None':
            return LogLevel.None;
        default:
            throw new Error(`Invalid logging configuration, logLevel value '${value}' is not supported.`);
    }
}
