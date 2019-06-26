/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID } from '@angular/core';

import { EventInfo, Logger, LoggerProvider, LoggingInfo, LogLevel, PageViewInfo } from '@dagonmetric/ng-log';
import { ApplicationInsights, IConfig, IConfiguration } from '@microsoft/applicationinsights-web';

import { ApplicationInsightsLogger } from './applicationinsights-logger';

export interface ApplicationInsightsLoggerOptions {
    config: IConfiguration & IConfig;
}

export const APPLICATIONINSIGHTS_LOGGER_OPTIONS = new InjectionToken<ApplicationInsightsLoggerOptions>('ApplicationInsightsLoggerOptions');

/**
 * Logger provider implementation for `ApplicationInsightsLogger`.
 */
@Injectable({
    providedIn: 'root'
})
export class ApplicationInsightsWebLoggerProvider extends Logger implements LoggerProvider {
    private readonly _loggers = new Map<string, ApplicationInsightsLogger | null>();
    private readonly _isBrowser: boolean;

    private _appInsights?: ApplicationInsights;
    private _config?: IConfiguration & IConfig;
    private _currentLogger: ApplicationInsightsLogger | undefined;

    get name(): string {
        return 'applicationinsights';
    }

    get currentLogger(): ApplicationInsightsLogger {
        if (this._currentLogger) {
            return this._currentLogger;
        }

        this._currentLogger = new ApplicationInsightsLogger(this._appInsights);

        return this._currentLogger;
    }

    set config(config: IConfiguration & IConfig) {
        if (!this._isBrowser) {
            return;
        }

        if (this._appInsights) {
            this._appInsights.config = { ...this._appInsights.config, ...this._config, ...config };
            this._config = this._appInsights.config;
        } else {
            this._appInsights = new ApplicationInsights({
                config: { ...this._config, ...config }
            });
            this._appInsights.loadAppInsights();
            this._config = this._appInsights.config;

            this.currentLogger.appInsights = this._appInsights;

            for (const pair of this._loggers) {
                const logger = pair[1];
                if (logger == null) {
                    this._loggers.delete(pair[0]);
                    continue;
                }

                logger.appInsights = this._appInsights;
            }
        }
    }

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        @Optional() @Inject(ApplicationInsightsLogger) options?: ApplicationInsightsLoggerOptions) {
        super();
        this._isBrowser = isPlatformBrowser(platformId);
        if (this._isBrowser && options && options.config) {
            if (options.config.instrumentationKey) {
                this._appInsights = new ApplicationInsights({
                    config: options.config
                });
                this._appInsights.loadAppInsights();
                this._config = this._appInsights.config;
            } else {
                this._config = options.config;
            }
        }
    }

    createLogger(category: string): Logger {
        const logger = this._loggers.get(category);
        if (logger) {
            return logger;
        }

        const newLogger = new ApplicationInsightsLogger(this._appInsights);

        this._loggers.set(category, newLogger);

        return newLogger;
    }

    setUserProperties(userId: string, accountId?: string): void {
        if (this._isBrowser && this._appInsights) {
            this._appInsights.setAuthenticatedUserContext(userId, accountId);
        }
    }

    clearUserProperties(): void {
        if (this._isBrowser && this._appInsights) {
            this._appInsights.clearAuthenticatedUserContext();
        }
    }

    log(logLevel: LogLevel, message: string | Error, optionalParams?: LoggingInfo): void {
        this.currentLogger.log(logLevel, message, optionalParams);
    }

    startTrackPage(name?: string): void {
        this.currentLogger.startTrackPage(name);
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewInfo): void {
        this.currentLogger.stopTrackPage(name, pageViewInfo);
    }

    trackPageView(namepageViewInfo: PageViewInfo & { name?: string }): void {
        this.currentLogger.trackPageView(namepageViewInfo);
    }

    startTrackEvent(name: string): void {
        this.currentLogger.startTrackEvent(name);
    }

    stopTrackEvent(name: string, eventInfo?: EventInfo): void {
        this.currentLogger.stopTrackEvent(name, eventInfo);
    }

    trackEvent(eventInfo: EventInfo & { name: string }): void {
        this.currentLogger.trackEvent(eventInfo);
    }

    flush(): void {
        this.currentLogger.flush();
    }
}
