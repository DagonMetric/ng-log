/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, Optional } from '@angular/core';

import { DefaultLogger } from './default-logger';
import { EventInfo, EventTimingInfo } from './event-info';
import {
    EventSection,
    LOG_CONFIG,
    LogConfig,
    LogConfigBase,
    LogLevelSection,
    LoggerSection,
    PageViewSection
} from './log-config';
import { LogInfo } from './log-info';
import { LogLevel } from './log-level';
import { Logger } from './logger';
import { LoggerFilterOptions, LoggerFilterRule } from './logger-filter-options';
import { LoggerInformation } from './logger-information';
import { LOGGER_PROVIDER, LoggerProvider } from './logger-provider';
import { PageViewInfo, PageViewTimingInfo } from './page-view-info';

interface SelectedRule {
    minLevel?: LogLevel;
    event?: { [name: string]: boolean };
    pageView?: boolean;
    userId?: boolean;
}

/**
 * Log service implementation.
 */
@Injectable({
    providedIn: 'any'
})
export class LogService extends Logger {
    private readonly loggerProviders: LoggerProvider[];
    private readonly loggers: { [key: string]: DefaultLogger } = {};
    private readonly rulesByProvider: { [key: string]: SelectedRule | undefined } = {};
    private readonly userIdsByProvider: { [key: string]: boolean | undefined } = {};
    private loggerFilterOptions?: LoggerFilterOptions;

    constructor(
        @Optional() @Inject(LOGGER_PROVIDER) loggerProviders?: LoggerProvider[],
        @Optional() @Inject(LOG_CONFIG) config?: LogConfig
    ) {
        super();
        this.loggerProviders = loggerProviders || [];
        if (config) {
            this.setConfig(config);
        }
    }

    /**
     * Sets logging configuration options.
     * @param config The logging config options.
     */
    setConfig(config: LogConfig): void {
        this.loggerFilterOptions = this.parseConfig(config);

        for (const loggerProvider of this.loggerProviders) {
            const providerName = loggerProvider.name;

            const rule = this.selectRule(providerName);
            this.rulesByProvider[providerName] = rule;
        }

        const categoryNames = Object.keys(this.loggers);

        for (const categoryName of categoryNames) {
            const logger = this.loggers[categoryName];
            this.refreshFilters(logger.loggerInformations);
        }
    }

    /**
     * Creates a child logger with category name.
     * @param category The category name for scoped logger.
     */
    createLogger(category: string): Logger {
        const logger = this.loggers[category];
        if (logger) {
            return logger;
        }

        const newLogger = new DefaultLogger();
        newLogger.loggerInformations = this.loggerProviders.map((loggerProvider) => {
            const providerType = loggerProvider.name;
            const rule = this.selectRule(providerType, category);

            return {
                logger: loggerProvider.createLogger(category),
                providerType,
                category,
                minLevel: rule && rule.minLevel != null ? rule.minLevel : undefined,
                pageView: rule && rule.pageView != null ? rule.pageView : undefined,
                event: rule && rule.event != null ? rule.event : undefined
            };
        });

        this.loggers[category] = newLogger;

        return newLogger;
    }

    /**
     * Destroys the child logger by category name.
     * @param category The category name for scoped logger.
     */
    destroyLogger(category: string): void {
        if (this.loggers[category] != null) {
            delete this.loggers[category];
        }

        for (const loggerProvider of this.loggerProviders) {
            if (loggerProvider.destroyLogger) {
                loggerProvider.destroyLogger(category);
            }
        }
    }

    /**
     * Sets the authenticated user id and the account id properties.
     * @param userId The authenticated user id.
     * @param accountId An optional string to represent the account associated with the authenticated user.
     */
    setUserProperties(userId: string, accountId?: string): void {
        for (const loggerProvider of this.loggerProviders) {
            if (!loggerProvider.setUserProperties) {
                continue;
            }

            const rule = this.rulesByProvider[loggerProvider.name];
            if (rule && rule.userId === false) {
                continue;
            }

            loggerProvider.setUserProperties(userId, accountId);
            this.userIdsByProvider[loggerProvider.name] = true;
        }
    }

    /**
     * Clears the authenticated user id and the account id from the user context.
     */
    clearUserProperties(): void {
        for (const loggerProvider of this.loggerProviders) {
            if (!loggerProvider.clearUserProperties) {
                continue;
            }

            const rule = this.rulesByProvider[loggerProvider.name];
            if (rule && rule.userId === false && !this.userIdsByProvider[loggerProvider.name]) {
                continue;
            }

            loggerProvider.clearUserProperties();
            this.userIdsByProvider[loggerProvider.name] = false;
        }
    }

    /**
     * Logs message or error with log level.
     * @param logLevel The log level.
     * @param message Message string or error object to log.
     * @param logInfo Optional log telemetry info parameter.
     */
    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        if (logLevel === LogLevel.None) {
            return;
        }

        for (const loggerProvider of this.loggerProviders) {
            const rule = this.rulesByProvider[loggerProvider.name];
            if (rule && rule.minLevel != null && logLevel < rule.minLevel) {
                continue;
            }

            loggerProvider.log(logLevel, message, logInfo);
        }
    }

    /**
     * Starts timing how long the user views a page. Calls this when the page opens.
     * @param name A string that idenfities this item, unique within the HTML document. Default to document title.
     */
    startTrackPage(name?: string): void {
        for (const loggerProvider of this.loggerProviders) {
            const rule = this.rulesByProvider[loggerProvider.name];
            if (rule && rule.pageView === false) {
                continue;
            }

            loggerProvider.startTrackPage(name);
        }
    }

    /**
     * Logs how long a page was visible, after `startTrackPage`. Calls this when the page closes.
     * @param name The string you used as the name in `startTrackPage`. Default to document title.
     * @param pageViewInfo Additional data for page view.
     */
    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void {
        for (const loggerProvider of this.loggerProviders) {
            const rule = this.rulesByProvider[loggerProvider.name];
            if (rule && rule.pageView === false) {
                continue;
            }

            loggerProvider.stopTrackPage(name, pageViewInfo);
        }
    }

    /**
     * Logs that a page was viewed.
     * @param pageViewInfo Data for page view.
     */
    trackPageView(pageViewInfo?: PageViewInfo): void {
        for (const loggerProvider of this.loggerProviders) {
            const rule = this.rulesByProvider[loggerProvider.name];
            if (rule && rule.pageView === false) {
                continue;
            }

            loggerProvider.trackPageView(pageViewInfo);
        }
    }

    /**
     * Starts timing an event. Calls `stopTrackEvent` to log the event when it ends.
     * @param name A string that identifies this event uniquely within the HTML document.
     */
    startTrackEvent(name: string): void {
        for (const loggerProvider of this.loggerProviders) {
            const rule = this.rulesByProvider[loggerProvider.name];
            if (rule && rule.event) {
                const evtOptions = rule.event;
                const foundDisabled =
                    Object.keys(evtOptions).find((key) => key === name && evtOptions[key] === false) != null;

                if (foundDisabled) {
                    continue;
                }
            }

            loggerProvider.startTrackEvent(name);
        }
    }

    /**
     * Logs an event that you started timing with `startTrackEvent`.
     * @param name The string you used to identify this event in `startTrackEvent`.
     * @param eventInfo Additional data for event.
     */
    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        for (const loggerProvider of this.loggerProviders) {
            const rule = this.rulesByProvider[loggerProvider.name];
            if (rule && rule.event) {
                const evtOptions = rule.event;
                const foundDisabled =
                    Object.keys(evtOptions).find((key) => key === name && evtOptions[key] === false) != null;

                if (foundDisabled) {
                    continue;
                }
            }

            loggerProvider.stopTrackEvent(name, eventInfo);
        }
    }

    /**
     * Logs a user action or other occurrence.
     * @param eventInfo Data for event.
     */
    trackEvent(eventInfo: EventInfo): void {
        for (const loggerProvider of this.loggerProviders) {
            const rule = this.rulesByProvider[loggerProvider.name];
            if (rule && rule.event) {
                const evtOptions = rule.event;
                const name = eventInfo.name;
                const foundDisabled =
                    Object.keys(evtOptions).find((key) => key === name && evtOptions[key] === false) != null;

                if (foundDisabled) {
                    continue;
                }
            }

            loggerProvider.trackEvent(eventInfo);
        }
    }

    /**
     * Flushes to send or log data immediately.
     */
    flush(): void {
        for (const loggerProvider of this.loggerProviders) {
            loggerProvider.flush();
        }
    }

    private refreshFilters(loggerInformations: LoggerInformation[]): void {
        for (const loggerInformation of loggerInformations) {
            const rule = this.selectRule(loggerInformation.providerType, loggerInformation.category);

            loggerInformation.minLevel = rule && rule.minLevel != null ? rule.minLevel : undefined;
            loggerInformation.pageView = rule && rule.pageView != null ? rule.pageView : undefined;
            loggerInformation.event = rule && rule.event != null ? rule.event : undefined;
        }
    }

    private selectRule(providerName: string, category?: string): SelectedRule | undefined {
        if (!this.loggerFilterOptions) {
            return undefined;
        }

        const options = this.loggerFilterOptions;

        let userId = options.userId;
        let minLevel = options.minLevel;
        let event = options.event;
        let pageView = options.pageView;

        let userIdCurrent: LoggerFilterRule | undefined;
        let logLevelCurrent: LoggerFilterRule | undefined;
        let pageViewCurrent: LoggerFilterRule | undefined;
        let eventCurrent: LoggerFilterRule | undefined;

        for (const rule of options.rules) {
            if (rule.userId != null && this.isBetter(rule, userIdCurrent, providerName, category)) {
                userIdCurrent = rule;
            }
            if (rule.logLevel != null && this.isBetter(rule, logLevelCurrent, providerName, category)) {
                logLevelCurrent = rule;
            }
            if (rule.pageView != null && this.isBetter(rule, pageViewCurrent, providerName, category)) {
                pageViewCurrent = rule;
            }
            if (rule.event != null && this.isBetter(rule, eventCurrent, providerName, category)) {
                eventCurrent = rule;
                event = { ...(event || {}), ...rule.event };
            }
        }

        if (userIdCurrent) {
            userId = userIdCurrent.userId;
        }
        if (logLevelCurrent) {
            minLevel = logLevelCurrent.logLevel;
        }
        if (pageViewCurrent) {
            pageView = pageViewCurrent.pageView;
        }

        return {
            userId,
            minLevel,
            event,
            pageView
        };
    }

    private isBetter(
        rule: LoggerFilterRule,
        current?: LoggerFilterRule,
        providerName?: string,
        category?: string
    ): boolean {
        if (rule.providerName && rule.providerName !== providerName) {
            return false;
        }

        if (rule.categoryName && category) {
            const categoryParts = rule.categoryName.split('*');
            const prefix = categoryParts[0];
            const suffix = categoryParts.length > 1 ? categoryParts[1] : '';

            if (
                !category.toLowerCase().startsWith(prefix.toLowerCase()) ||
                !category.toLowerCase().endsWith(suffix.toLowerCase())
            ) {
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

    private parseConfig(config: LogConfig): LoggerFilterOptions {
        const options: LoggerFilterOptions = {
            rules: [],
            userId: config.userId
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
            .filter((key: keyof LogConfigBase) => key !== 'userId' && key !== 'minLevel')
            .forEach((key: keyof LogConfigBase) => {
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

    private parseSections(options: LoggerFilterOptions, config: LoggerSection, providerName?: string): boolean {
        let hasError = false;

        if (config.userId != null) {
            const rule: LoggerFilterRule = { userId: config.userId, providerName };
            options.rules.push(rule);
        }

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

    private parseLogLevelSection(
        options: LoggerFilterOptions,
        section: LogLevelSection,
        providerName?: string
    ): boolean {
        let hasError = false;

        Object.keys(section).forEach((key) => {
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

    private parsePageViewSection(
        options: LoggerFilterOptions,
        section: PageViewSection,
        providerName?: string
    ): boolean {
        let hasError = false;

        Object.keys(section).forEach((key) => {
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
        providerName?: string
    ): boolean {
        const isEventObject = Object.keys(section).find((key) => typeof section[key] === 'boolean') != null;
        if (isEventObject) {
            const event = section as { [name: string]: boolean };
            const rule: LoggerFilterRule = { event, providerName };
            options.rules.push(rule);

            return true;
        }

        let hasError = false;

        Object.keys(section).forEach((key) => {
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
                this.logInvalidLoggingConfigError(JSON.stringify(value), 'event');
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

    private logInvalidLoggingConfigError(value: string, propName: string): void {
        console.error(`Invalid logging configuration, ${propName} value '${value}' is not supported.`);
    }

    private logInvalidCategoryWildcardError(): void {
        console.error('Invalid logging configuration, only one wildcard character is allowed in category name.');
    }
}
