/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, Optional } from '@angular/core';

import { DefaultLogger } from './default-logger';
import { LogLevel, LogLevelString } from './log-level';
import { Logger } from './logger';
import { LoggerFilterOptions, LoggerFilterRule } from './logger-filter-options';
import { LoggerInformation } from './logger-information';
import { LOGGER_PROVIDER, LoggerProvider } from './logger-provider';
import { EventSection, LOGGING_CONFIG, LoggingConfig, LoggingConfigBase, LogLevelSection, PageViewSection } from './logging-config';

/**
 * Log service implementation.
 */
@Injectable({
    providedIn: 'root'
})
export class LogService {
    private readonly _loggerProviders: LoggerProvider[];
    private readonly _loggers = new Map<string, DefaultLogger>();
    private _loggerFilterOptions?: LoggerFilterOptions;
    private _userIdEnabled = true;
    private _isUserIdSet = false;

    constructor(
        @Optional() @Inject(LOGGER_PROVIDER) loggerProviders?: LoggerProvider[],
        @Optional() @Inject(LOGGING_CONFIG) config?: LoggingConfig) {
        this._loggerProviders = loggerProviders || [];
        if (config) {
            this.setConfig(config);
        }
    }

    createLogger(category: string): Logger {
        const logger = this._loggers.get(category);
        if (logger) {
            return logger;
        }

        const newLogger = new DefaultLogger();
        newLogger.loggerInformations = this._loggerProviders.map(loggerProvider => {
            const providerType = loggerProvider.name;
            const rule = this.selectRule(providerType, category);

            return {
                logger: loggerProvider.createLogger(category),
                providerType: providerType,
                category: category,
                minLevel: rule && rule.minLevel != null ? rule.minLevel : undefined,
                pageView: rule && rule.pageView != null ? rule.pageView : undefined,
                event: rule && rule.event != null ? rule.event : undefined
            };
        });

        this._loggers.set(category, newLogger);

        return newLogger;
    }

    setConfig(config: LoggingConfig): void {
        this._loggerFilterOptions = this.parseConfig(config);

        this._userIdEnabled = this._loggerFilterOptions.userId != null ? this._loggerFilterOptions.userId : true;
        if (!this._userIdEnabled && this._isUserIdSet) {
            this.clearAuthenticatedUserContext();
        }

        for (const pair of this._loggers) {
            const logger = pair[1];
            this.refreshFilters(logger.loggerInformations);
        }
    }

    /**
     * Sets the authenticated user id and the account id in this session.
     * @param authenticatedUserId The authenticated user id.
     * @param accountId An optional string to represent the account associated with the authenticated user.
     */
    setAuthenticatedUserContext(userId: string, accountId?: string): void {
        if (!this._userIdEnabled) {
            return;
        }

        for (const loggerProvider of this._loggerProviders) {
            loggerProvider.setAuthenticatedUserContext(userId, accountId);
        }

        this._isUserIdSet = true;
    }

    /**
     * Clears the authenticated user id and the account id from the user context.
     */
    clearAuthenticatedUserContext(): void {
        for (const loggerProvider of this._loggerProviders) {
            loggerProvider.clearAuthenticatedUserContext();
        }

        this._isUserIdSet = false;
    }

    private refreshFilters(loggerInformations: LoggerInformation[]): void {
        for (const loggerInformation of loggerInformations) {
            const rule = this.selectRule(loggerInformation.providerType, loggerInformation.category);

            loggerInformation.minLevel = rule && rule.minLevel != null ? rule.minLevel : undefined;
            loggerInformation.pageView = rule && rule.pageView != null ? rule.pageView : undefined;
            loggerInformation.event = rule && rule.event != null ? rule.event : undefined;
        }
    }

    private selectRule(
        providerName: string,
        category: string): { minLevel?: LogLevel; event?: { [name: string]: boolean }; pageView?: boolean } | undefined {
        if (!this._loggerFilterOptions) {
            return undefined;
        }

        const options = this._loggerFilterOptions;

        let minLevel = options.minLevel;
        let event = options.event;
        let pageView = options.pageView;

        let logLevelCurrent: LoggerFilterRule | undefined;
        let pageViewCurrent: LoggerFilterRule | undefined;
        let eventCurrent: LoggerFilterRule | undefined;

        for (const rule of options.rules) {
            if (rule.logLevel != null && this.isBetter(rule, logLevelCurrent, providerName, category)) {
                logLevelCurrent = rule;
            }
            if (rule.pageView != null && this.isBetter(rule, pageViewCurrent, providerName, category)) {
                pageViewCurrent = rule;
            }
            if (rule.event != null && this.isBetter(rule, eventCurrent, providerName, category)) {
                eventCurrent = rule;
                event = { ... (event || {}), ...rule.event };
            }
        }

        if (logLevelCurrent) {
            minLevel = logLevelCurrent.logLevel;
        }
        if (pageViewCurrent) {
            pageView = pageViewCurrent.pageView;
        }

        return {
            minLevel,
            event,
            pageView
        };
    }

    private isBetter(rule: LoggerFilterRule, current?: LoggerFilterRule, providerName?: string, category?: string): boolean {
        if (rule.providerName && rule.providerName !== providerName) {
            return false;
        }

        if (rule.categoryName && category) {
            const categoryParts = rule.categoryName.split('*');
            const prefix = categoryParts[0];
            const suffix = categoryParts.length > 1 ? categoryParts[1] : '';

            if (!category.toLowerCase().startsWith(prefix.toLowerCase()) || !category.toLowerCase().endsWith(suffix.toLowerCase())) {
                return false;
            }
        }

        if (current && current.providerName) {
            if (!rule.providerName) {
                return false;
            }
        } else {
            if (rule.providerName) {
                return true;
            }
        }

        if (current && current.categoryName) {
            if (!rule.categoryName) {
                return false;
            }

            if (current.categoryName.length > rule.categoryName.length) {
                return false;
            }
        }

        return true;
    }

    private parseConfig(config: LoggingConfig): LoggerFilterOptions {
        const options: LoggerFilterOptions = {
            userId: config.userId,
            rules: []
        };
        let hasError = false;

        if (config.minLevel != null) {
            const minLevel = this.toLogLevel(config.minLevel, 'minLevel');

            if (minLevel == null) {
                hasError = true;
            } else {
                options.minLevel = minLevel;
            }
        }

        Object.keys(config)
            .filter((key: keyof LoggingConfigBase) => key !== 'userId' && key !== 'minLevel')
            .forEach((key: keyof LoggingConfigBase) => {
                if (key === 'logLevel' || key === 'pageView' || key === 'event') {
                    if (!this.parseSections(options, config)) {
                        hasError = true;
                    }

                    return;
                }

                const section = config[key];
                if (section != null && typeof section === 'object') {
                    if (!this.parseSections(options, section, key)) {
                        hasError = true;
                    }
                }
            });

        return hasError ? { rules: [] } : options;
    }

    private parseSections(
        options: LoggerFilterOptions,
        config: {
            logLevel?: LogLevelSection | LogLevelString;
            pageView?: PageViewSection | boolean;
            event?: EventSection | { [name: string]: boolean };
        },
        providerName?: string): boolean {
        let hasError = false;

        if (config.logLevel != null) {
            if (typeof config.logLevel === 'string') {
                const logLevel = this.toLogLevel(config.logLevel);
                if (logLevel != null) {
                    const rule: LoggerFilterRule = { logLevel, providerName };
                    options.rules.push(rule);
                } else {
                    hasError = true;
                }
            } else if (typeof config.logLevel === 'object') {
                if (!this.parseLogLevelSection(options, config.logLevel, providerName)) {
                    hasError = true;
                }
            } else {
                this.logInvalidLoggingConfigError(config.logLevel, 'logLevel');
                hasError = true;
            }
        }

        if (config.pageView != null) {
            if (typeof config.pageView === 'boolean') {
                const pageView = config.pageView;
                const rule: LoggerFilterRule = { pageView, providerName };
                options.rules.push(rule);
            } else if (typeof config.pageView === 'object') {
                if (!this.parsePageViewSection(options, config.pageView, providerName)) {
                    hasError = true;
                }
            } else {
                this.logInvalidLoggingConfigError(config.pageView, 'pageView');
                hasError = true;
            }
        }

        if (config.event != null) {
            if (typeof config.event === 'object') {
                if (!this.parseEventSection(options, config.event, providerName)) {
                    hasError = true;
                }
            } else {
                this.logInvalidLoggingConfigError(config.event, 'event');
                hasError = true;
            }
        }

        return !hasError;
    }

    private parseLogLevelSection(options: LoggerFilterOptions, section: LogLevelSection, providerName?: string): boolean {
        let hasError = false;

        Object.keys(section)
            .forEach(key => {
                if (key.split('*').length > 2) {
                    this.logInvalidCategoryWildcardError();
                    hasError = true;

                    return;
                }

                let logLevel: LogLevel | undefined;
                const value = section[key];

                if (typeof value === 'string') {
                    logLevel = this.toLogLevel(value);
                    if (logLevel == null) {
                        hasError = true;
                    }
                } else {
                    this.logInvalidLoggingConfigError(value, 'logLevel');
                    hasError = true;
                }

                if (logLevel != null) {
                    const rule: LoggerFilterRule = { logLevel, providerName };
                    if (key.toLowerCase() !== 'default') {
                        rule.categoryName = key;
                    }

                    options.rules.push(rule);
                }
            });

        return !hasError;
    }

    private parsePageViewSection(options: LoggerFilterOptions, section: PageViewSection, providerName?: string): boolean {
        let hasError = false;

        Object.keys(section)
            .forEach(key => {
                if (key.split('*').length > 2) {
                    this.logInvalidCategoryWildcardError();
                    hasError = true;

                    return;
                }

                let pageView: boolean | undefined;
                const value = section[key];

                if (typeof value === 'boolean') {
                    pageView = value;
                } else {
                    this.logInvalidLoggingConfigError(value, 'pageView');
                    hasError = true;
                }

                if (pageView != null) {
                    const rule: LoggerFilterRule = { pageView, providerName };
                    if (key.toLowerCase() !== 'default') {
                        rule.categoryName = key;
                    }

                    options.rules.push(rule);
                }
            });

        return !hasError;
    }

    private parseEventSection(
        options: LoggerFilterOptions,
        section: EventSection | { [name: string]: boolean },
        providerName?: string): boolean {
        const isEventObject = Object.keys(section).find(key => typeof section[key] === 'boolean') != null;
        if (isEventObject) {
            const event = section as { [name: string]: boolean };
            const rule: LoggerFilterRule = { event, providerName };
            options.rules.push(rule);

            return true;
        }

        let hasError = false;

        Object.keys(section)
            .forEach(key => {
                if (key.split('*').length > 2) {
                    this.logInvalidCategoryWildcardError();
                    hasError = true;

                    return;
                }

                let event: { [name: string]: boolean } | undefined;
                const value = section[key];

                if (typeof value === 'object') {
                    event = value;
                } else {
                    this.logInvalidLoggingConfigError(value, 'event');
                    hasError = true;
                }

                if (event != null) {
                    const rule: LoggerFilterRule = { event, providerName };
                    if (key.toLowerCase() !== 'default') {
                        rule.categoryName = key;
                    }

                    options.rules.push(rule);
                }
            });

        return !hasError;
    }

    private toLogLevel(value: string, propName: string = 'logLevel'): LogLevel | undefined {
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
            case 'fatal':
            case 'Fatal':
                return LogLevel.Critical;
            case 'none':
            case 'None':
                return LogLevel.None;
            default: {
                this.logInvalidLoggingConfigError(value, propName);

                return undefined;
            }
        }
    }

    private logInvalidLoggingConfigError(value: string | number | Object, propName: string): void {
        console.error(`Invalid logging configuration, ${propName} value '${value}' is not supported.`);
    }

    private logInvalidCategoryWildcardError(): void {
        console.error('Invalid logging configuration, only one wildcard character is allowed in category name.');
    }
}
