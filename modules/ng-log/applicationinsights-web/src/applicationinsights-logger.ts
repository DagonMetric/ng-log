/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { EventInfo, Logger, LoggingInfo, LogLevel, PageViewInfo } from '@dagonmetric/ng-log';
import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';

/**
 * Microsoft ApplicationInsights implementation for `Logger`.
 */
export class ApplicationInsightsLogger extends Logger {
    constructor(public appInsights?: ApplicationInsights) {
        super();
    }

    log(logLevel: LogLevel, message: string | Error, optionalParams?: LoggingInfo): void {
        if (!this.appInsights || logLevel === LogLevel.None) {
            return;
        }

        const severityLevel = ApplicationInsightsLogger.toSeverityLevel(logLevel);
        const measurements = optionalParams && optionalParams.measurements ?
            optionalParams.measurements : undefined;
        const extraProperties = optionalParams && optionalParams.properties ?
            optionalParams.properties : undefined;

        if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            this.appInsights.trackException({
                exception: typeof message === 'string' ? new Error(message) : message,
                severityLevel,
                measurements: measurements,
                properties: extraProperties
            });
        } else {
            this.appInsights.trackTrace({
                message: typeof message === 'string' ? message : `${message}`,
                severityLevel,
                properties: extraProperties
            });
        }
    }

    startTrackPage(name?: string): void {
        if (!this.appInsights) {
            return;
        }

        this.appInsights.startTrackPage(name);
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewInfo): void {
        if (!this.appInsights) {
            return;
        }

        const uri = pageViewInfo && pageViewInfo.uri ? pageViewInfo.uri : undefined;
        const measurements = pageViewInfo && pageViewInfo.measurements ? pageViewInfo.measurements : undefined;
        const extraProperties = pageViewInfo && pageViewInfo.properties ? pageViewInfo.properties : undefined;
        const customProperties = ApplicationInsightsLogger.filterPageViewCustomProperties(pageViewInfo);

        this.appInsights.stopTrackPage(name, uri, { ...extraProperties, ...customProperties }, measurements);
    }

    trackPageView(pageViewInfo?: PageViewInfo & { name?: string }): void {
        if (!this.appInsights) {
            return;
        }

        const name = pageViewInfo && pageViewInfo.name ? pageViewInfo.name : undefined;
        const uri = pageViewInfo && pageViewInfo.uri ? pageViewInfo.uri : undefined;
        const measurements = pageViewInfo && pageViewInfo.measurements ? pageViewInfo.measurements : undefined;
        const extraProperties = pageViewInfo && pageViewInfo.properties ? pageViewInfo.properties : undefined;
        const customProperties = ApplicationInsightsLogger.filterPageViewCustomProperties(pageViewInfo);

        this.appInsights.trackPageView({
            ...customProperties,
            name,
            uri,
            measurements,
            properties: extraProperties
        });
    }

    startTrackEvent(name: string): void {
        if (!this.appInsights) {
            return;
        }

        this.appInsights.startTrackEvent(name);
    }

    stopTrackEvent(name: string, eventInfo?: EventInfo): void {
        if (!this.appInsights) {
            return;
        }

        const measurements = eventInfo && eventInfo.measurements ? eventInfo.measurements : undefined;
        const extraProperties = eventInfo && eventInfo.properties ? eventInfo.properties : undefined;
        const customProperties = ApplicationInsightsLogger.filterEventCustomProperties(eventInfo);

        this.appInsights.stopTrackEvent(name, { ...extraProperties, ...customProperties }, measurements);
    }

    trackEvent(eventInfo: EventInfo & { name: string }): void {
        if (!this.appInsights) {
            return;
        }

        const name = eventInfo.name;
        const measurements = eventInfo && eventInfo.measurements ? eventInfo.measurements : undefined;
        const extraProperties = eventInfo && eventInfo.properties ? eventInfo.properties : undefined;
        const customProperties = ApplicationInsightsLogger.filterEventCustomProperties(eventInfo);

        this.appInsights.trackEvent({
            ...customProperties,
            name,
            measurements,
            properties: extraProperties,
        });
    }

    flush(): void {
        if (!this.appInsights) {
            return;
        }

        this.appInsights.flush();
    }

    private static toSeverityLevel(logLevel: LogLevel): SeverityLevel {
        if (logLevel === LogLevel.Critical) {
            return SeverityLevel.Critical;
        } else if (logLevel === LogLevel.Error) {
            return SeverityLevel.Error;
        } else if (logLevel === LogLevel.Warn) {
            return SeverityLevel.Warning;
        } else if (logLevel === LogLevel.Info) {
            return SeverityLevel.Information;
        } else {
            return SeverityLevel.Verbose;
        }
    }

    private static filterPageViewCustomProperties(
        properties?: PageViewInfo,
        excludeKeys: (keyof PageViewInfo | 'name')[]
            = ['name', 'uri', 'customMap', 'measurements', 'properties']): { [key: string]: string } | undefined {
        if (!properties) {
            return undefined;
        }
        // tslint:disable-next-line: no-any
        const mappedProperties: { [key: string]: any } = {};
        const props = properties;

        Object.keys(props)
            .filter((key: keyof PageViewInfo) => excludeKeys.length === 0 || !excludeKeys.includes(key))
            .forEach((key: keyof PageViewInfo) => {
                mappedProperties[key] = props[key];
            });

        return mappedProperties;
    }

    private static filterEventCustomProperties(
        properties?: EventInfo,
        excludeKeys: (keyof EventInfo | 'name')[]
            = ['name', 'customMap', 'measurements', 'properties']): { [name: string]: string } | undefined {
        if (!properties) {
            return undefined;
        }
        // tslint:disable-next-line: no-any
        const mappedProperties: { [name: string]: any } = {};
        const props = properties;

        Object.keys(props)
            .filter((key: keyof EventInfo) => excludeKeys.length === 0 || !excludeKeys.includes(key))
            .forEach((key: keyof EventInfo) => {
                mappedProperties[key] = props[key];
            });

        return mappedProperties;
    }
}
