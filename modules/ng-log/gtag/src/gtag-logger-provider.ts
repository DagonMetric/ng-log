/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID } from '@angular/core';

import { Logger, LoggerProvider } from '@dagonmetric/ng-log';

import { GTag } from './gtag';
import { GTagLogger } from './gtag-logger';
import { GTagPropertiesMapper } from './gtag-properties-mapper';

export interface GTagLoggerOptions {
    measurementId?: string;
    customMap?: { [key: string]: string };
}

export const GTAG_LOGGER_OPTIONS = new InjectionToken<GTagLoggerOptions>('GTagLoggerOptions');

/**
 * Logger provider factory for `GTagLogger`.
 */
@Injectable({
    providedIn: 'root'
})
export class GTagLoggerProvider extends LoggerProvider {
    private readonly _loggers = new Map<string, GTagLogger | null>();
    private readonly _options: GTagLoggerOptions;
    private readonly _propertiesMapper: GTagPropertiesMapper;
    private readonly _gtag: GTag | undefined;
    private readonly _isBrowser: boolean;

    private _customMap: { [key: string]: string } | undefined;
    private _measurementId: string | undefined;
    private _userId: string | undefined;
    private _accountId: string | undefined;
    private _currentLogger: GTagLogger | undefined;

    get name(): string {
        return 'gtag';
    }

    get currentLogger(): GTagLogger {
        if (this._currentLogger) {
            return this._currentLogger;
        }

        this._currentLogger = new GTagLogger(
            this._propertiesMapper,
            this._gtag,
            this._customMap,
            this._measurementId,
            this._userId,
            this._accountId);

        return this._currentLogger;
    }

    set measurementId(value: string) {
        this._measurementId = value;

        if (this._currentLogger) {
            this._currentLogger.measurementId = value;
        }

        for (const pair of this._loggers) {
            const logger = pair[1];
            if (logger == null) {
                this._loggers.delete(pair[0]);
                continue;
            }

            logger.measurementId = value;
        }
    }

    set customMap(value: { [key: string]: string }) {
        this._customMap = value;

        if (this._currentLogger) {
            this._currentLogger.customMap = value;
        }

        for (const pair of this._loggers) {
            const logger = pair[1];
            if (logger == null) {
                this._loggers.delete(pair[0]);
                continue;
            }

            logger.customMap = value;
        }
    }

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        @Optional() @Inject(GTAG_LOGGER_OPTIONS) options?: GTagLoggerOptions) {
        super();
        this._isBrowser = isPlatformBrowser(platformId);
        this._options = options || {};
        this._measurementId = this._options.measurementId;
        this._customMap = this._options.customMap;

        // tslint:disable-next-line: no-any
        if (this._isBrowser && window && (window as any).gtag) {
            // tslint:disable-next-line: no-any
            this._gtag = (window as any).gtag as GTag;
        }

        this._propertiesMapper = new GTagPropertiesMapper();
    }

    createLogger(category: string): Logger {
        const logger = this._loggers.get(category);
        if (logger) {
            return logger;
        }

        const newLogger = new GTagLogger(
            this._propertiesMapper,
            this._gtag,
            this._customMap,
            this._measurementId,
            this._userId,
            this._accountId);

        this._loggers.set(category, newLogger);

        return newLogger;
    }

    setUserProperties(userId: string, accountId?: string): void {
        this._userId = userId;
        this._accountId = accountId;

        if (this._currentLogger) {
            this._currentLogger.userId = userId;
            this._currentLogger.accountId = accountId;
        }

        for (const pair of this._loggers) {
            const logger = pair[1];
            if (logger == null) {
                this._loggers.delete(pair[0]);
                continue;
            }

            logger.userId = userId;
            logger.accountId = accountId;
        }

        if (!this._isBrowser || !this._gtag || !this._measurementId) {
            return;
        }

        // this._gtag('config', this._measurementId, {
        //     user_id: userId
        // });
    }

    clearUserProperties(): void {
        this._userId = undefined;
        this._accountId = undefined;

        if (this._currentLogger) {
            this._currentLogger.userId = undefined;
            this._currentLogger.accountId = undefined;
        }

        for (const pair of this._loggers) {
            const logger = pair[1];
            if (logger == null) {
                this._loggers.delete(pair[0]);
                continue;
            }

            logger.userId = undefined;
            logger.accountId = undefined;
        }
    }
}
