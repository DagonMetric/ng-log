/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Injector, PLATFORM_ID } from '@angular/core';

import { Logger, LoggerProvider } from '@dagonmetric/ng-log';

import { DefaultGTagPropertiesMapper } from './default-gtag-properties-mapper';
import { GTag } from './gtag';
import { GTagLogger } from './gtag-logger';
import { GTagPropertiesMapper } from './gtag-properties-mapper';

export interface GTagLoggerProviderOptions {
    measurementId: string;
    propertiesMapper?: GTagPropertiesMapper | InjectionToken<GTagPropertiesMapper>;
}

export const GTAG_LOGGER_PROVIDER_OPTIONS = new InjectionToken<GTagLoggerProviderOptions>('GTagLoggerProviderOptions');

/**
 * Logger provider factory for `GTagLogger`.
 */
@Injectable({
    providedIn: 'root'
})
export class GTagLoggerProvider implements LoggerProvider {
    private readonly _loggers = new Map<string, GTagLogger>();
    private readonly _propertiesMapper: GTagPropertiesMapper;
    private readonly _gtag: GTag | undefined;
    private readonly _isBrowser: boolean;

    constructor(
        injector: Injector,
        @Inject(PLATFORM_ID) platformId: Object,
        @Inject(GTAG_LOGGER_PROVIDER_OPTIONS) private readonly _options: GTagLoggerProviderOptions) {
        this._isBrowser = isPlatformBrowser(platformId);
        // tslint:disable-next-line: no-any
        if (this._isBrowser && window && (window as any).gtag) {
            // tslint:disable-next-line: no-any
            this._gtag = (window as any).gtag as GTag;
        }

        if (this._options.propertiesMapper && this._options.propertiesMapper instanceof InjectionToken) {
            this._propertiesMapper = injector.get(this._options.propertiesMapper);
        } else if (this._options.propertiesMapper && typeof this._options.propertiesMapper === 'object') {
            this._propertiesMapper = this._options.propertiesMapper;
        } else {
            this._propertiesMapper = new DefaultGTagPropertiesMapper();
        }
    }

    get name(): string {
        return 'gtag';
    }

    createLogger(category: string): Logger {
        const logger = this._loggers.get(category);
        if (logger) {
            return logger;
        }

        const newLogger = new GTagLogger(category, this._propertiesMapper, this._gtag, this._options.measurementId);
        this._loggers.set(category, newLogger);

        return newLogger;
    }

    setAuthenticatedUserContext(userId: string): void {
        if (!this._isBrowser || !this._gtag || !this._options.measurementId) {
            return;
        }

        this._gtag('config', this._options.measurementId, {
            user_id: userId
        });
    }

    clearAuthenticatedUserContext(): void {
        // Do nothing
    }

    setMeasurementId(measurementId: string): void {
        if (!this._isBrowser || !this._gtag) {
            return;
        }

        this._options.measurementId = measurementId;

        for (const pair of this._loggers) {
            const logger = pair[1];
            logger.measurementId = measurementId;
        }
    }

    // tslint:disable-next-line: no-any
    config(parameters: any): void {
        if (!this._isBrowser || !this._gtag) {
            return;
        }

        this._gtag('config', this._options.measurementId, parameters);
    }
}
