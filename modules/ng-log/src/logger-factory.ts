/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, Optional } from '@angular/core';

import { DefaultLogger } from './default-logger';
import { LogLevel } from './log-level';
import { Logger } from './logger';
import { LoggerFilterRule } from './logger-filter-rule';
import { FilterFunc } from './logger-information';
import { LOGGER_CONFIG, LoggerConfig, LoggerFilterOptions } from './logger-options';
import { LOGGER_PROVIDER, LoggerProvider } from './logger-provider';
import { NullLogger } from './null-logger';
import { parseConfig } from './parse-config';

/**
 * The logger factory implementation.
 */
@Injectable({
    providedIn: 'root'
})
export class LoggerFactory {
    private readonly _loggers = new Map<string, Logger>();
    private _loggerFilterOptions: LoggerFilterOptions | null | undefined;
    private _nullLogger: NullLogger | null | undefined;

    constructor(
        @Optional() @Inject(LOGGER_PROVIDER) private readonly _loggerProviders?: LoggerProvider[],
        @Optional() @Inject(LOGGER_CONFIG) config?: LoggerFilterOptions | LoggerConfig) {
        if (config) {
            this._loggerFilterOptions = parseConfig(config);
        }
    }

    createLogger(category: string): Logger {
        if (!category) {
            throw new Error('The category name is required.');
        }

        if (!this._loggerProviders || !this._loggerProviders.length) {
            if (!this._nullLogger) {
                this._nullLogger = new NullLogger();
            }

            return this._nullLogger;
        }

        const logger = this._loggers.get(category);
        if (logger) {
            return logger;
        }

        const defaultLogger = new DefaultLogger();
        defaultLogger.loggers = this._loggerProviders.map(loggerProvider => {
            const providerType = loggerProvider.name;
            const rule = this.getRule(providerType, category);

            return {
                logger: loggerProvider.createLogger(category),
                providerType: providerType,
                category: category,
                minLevel: rule && rule.minLevel ? rule.minLevel : undefined,
                filter: rule && rule.filter ? rule.filter : undefined
            };
        });

        this._loggers.set(category, defaultLogger)

        return defaultLogger;
    }

    setConfig(config: LoggerFilterOptions | LoggerConfig): void {
        this._loggerFilterOptions = parseConfig(config);
    }

    private getRule(providerName: string, category: string): {
        minLevel: LogLevel | undefined | null;
        filter: FilterFunc | undefined | null;
    } | null | undefined {
        if (!this._loggerFilterOptions) {
            return undefined;
        }

        const options = this._loggerFilterOptions;

        let minLevel = options.minLevel;
        let filter: FilterFunc | null | undefined;
        let current: LoggerFilterRule | null | undefined = null;

        if (options.rules) {
            for (const rule of options.rules) {
                if (LoggerFactory.isBetter(rule, current, providerName, category)) {
                    current = rule;
                }
            }
        }

        if (current) {
            minLevel = current.logLevel;
            filter = this.createFilterFunc(current);
        }

        return {
            minLevel,
            filter
        };
    }

    private createFilterFunc(rule: LoggerFilterRule): FilterFunc {
        return (providerType: string, category: string, level: LogLevel): boolean => {
            if (rule.providerName !== providerType) {
                return true;
            }

            if (rule.categoryName && !category.toLowerCase()
                .startsWith(rule.categoryName.toLowerCase())) {
                return true;
            }

            if (rule.logLevel != null &&
                level < rule.logLevel) {
                return false;
            }

            return true;
        };
    }

    private static isBetter(rule: LoggerFilterRule,
        current: LoggerFilterRule | null,
        providerName: string | null,
        category: string | null): boolean {
        if (rule.providerName && rule.providerName !== providerName) {
            return false;
        }

        if (rule.categoryName && category && !category.toLowerCase()
            .startsWith(rule.categoryName.toLowerCase())) {
            return false;
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
}
