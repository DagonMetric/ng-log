/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable: no-any

import { EventInfo, EventTimingInfo, Logger, LogInfo, LogLevel, PageViewInfo, PageViewTimingInfo } from '@dagonmetric/ng-log';

import { GTag } from './gtag';
import { GTagPropertiesMapper } from './gtag-properties-mapper';

/**
 * Google global site tag implementation for `Logger`.
 */
export class GTagLogger extends Logger {
    private readonly _eventTiming: Map<string, number> = new Map<string, number>();

    constructor(
        private readonly _propertiesMapper: GTagPropertiesMapper,
        private readonly _gtag?: GTag,
        public customMap?: { [key: string]: string },
        public measurementId?: string,
        public userId?: string,
        public accountId?: string) {
        super();
    }

    log(logLevel: LogLevel, message: string | Error, logInfo?: LogInfo): void {
        if (!this._gtag || !this.measurementId || logLevel === LogLevel.None) {
            return;
        }

        const mappedProps = this.getMappedLogInfo(logInfo);

        if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            const exceptionProps = {
                description: message,
                fatal: logLevel === LogLevel.Critical
            };

            if (logInfo && logInfo.customMap) {
                const customMap = this.getCustomMap(mappedProps, logInfo && logInfo.customMap ? logInfo.customMap : undefined);
                if (customMap) {
                    this._gtag('config', this.measurementId, {
                        custom_map: customMap
                    });
                }
            }

            this._gtag('event', 'exception', {
                ...mappedProps,
                ...exceptionProps
            });
        } else {
            let level = '';
            if (logLevel === LogLevel.Trace) {
                level = 'trace';
            } else if (logLevel === LogLevel.Debug) {
                level = 'debug';
            } else if (logLevel === LogLevel.Info) {
                level = 'info';
            } else if (logLevel === LogLevel.Warn) {
                level = 'warn';
            }

            const traceProps = {
                message: typeof message === 'string' ? message : `${message}`,
                level
            };

            this._gtag('event', 'trace', {
                ...mappedProps,
                ...traceProps
            });
        }
    }

    startTrackPage(name?: string): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        if (name == null) {
            name = window.document.title || '';
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        if (this._eventTiming.get(name) != null) {
            console.error(`The 'startTrackPage' was called more than once for this event without calling stop, name: ${name}.`);

            return;
        }

        this._eventTiming.set(name, +new Date());
    }

    stopTrackPage(name?: string, pageViewInfo?: PageViewTimingInfo): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        if (name == null) {
            name = window.document.title || '';
        }

        if (!name) {
            console.error('Could not detect document title, please provide name parameter.');

            return;
        }

        const start = this._eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackPage' was called without a corresponding start, name: ${name}.`);

            return;
        }

        const duration = GTagLogger.getDuration(start);
        const mappedProps = this.getMappedPageViewInfo(name, pageViewInfo);
        const customMap = this.getCustomMap(mappedProps, pageViewInfo && pageViewInfo.customMap ? pageViewInfo.customMap : undefined);
        if (customMap) {
            this._gtag('config', this.measurementId, {
                custom_map: customMap
            });
        }

        this._gtag('event', 'timing_complete', {
            ...mappedProps,
            name,
            value: duration
        });

        this._eventTiming.delete(name);
    }

    trackPageView(pageViewInfo?: PageViewInfo): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        const mappedProps = this.getMappedPageViewInfo(undefined, pageViewInfo);
        const customMap = this.getCustomMap(mappedProps, pageViewInfo && pageViewInfo.customMap ? pageViewInfo.customMap : undefined);
        if (customMap) {
            this._gtag('config', this.measurementId, {
                custom_map: customMap
            });
        }
        this._gtag('config', this.measurementId, mappedProps);
    }

    startTrackEvent(name: string): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        if (this._eventTiming.get(name) != null) {
            console.error(`The 'startTrackEvent' was called more than once for this event without calling stop, name: ${name}.`);

            return;
        }

        this._eventTiming.set(name, +new Date());
    }

    stopTrackEvent(name: string, eventInfo?: EventTimingInfo): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        const start = this._eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackEvent' was called without a corresponding start, name: ${name}.`);

            return;
        }

        const duration = GTagLogger.getDuration(start);
        const mappedProps = this.getMappedEventInfo(eventInfo);
        const customMap = this.getCustomMap(mappedProps, eventInfo && eventInfo.customMap ? eventInfo.customMap : undefined);
        if (customMap) {
            this._gtag('config', this.measurementId, {
                custom_map: customMap
            });
        }
        this._gtag('event', 'timing_complete', {
            ...mappedProps,
            name,
            value: duration
        });

        this._eventTiming.delete(name);
    }

    trackEvent(eventInfo: EventInfo): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        const mappedProps = this.getMappedEventInfo(eventInfo);
        const customMap = this.getCustomMap(mappedProps, eventInfo && eventInfo.customMap ? eventInfo.customMap : undefined);
        if (customMap) {
            this._gtag('config', this.measurementId, {
                custom_map: customMap
            });
        }

        this._gtag('event', eventInfo.name, mappedProps);
    }

    flush(): void {
        // Do nothing
    }

    private static getDuration(start: number): number | undefined {
        const end = +new Date();

        let duration: number | undefined;

        if (!(isNaN(start) || isNaN(end))) {
            duration = Math.max(end - start, 0);
        }

        return duration;
    }

    private getCustomMap(
        mappedProps: { [key: string]: any },
        currentCustomMap?: { [key: string]: string }): { [key: string]: string } | undefined {
        const customMap: { [key: string]: string } = {};
        const keys = Object.keys(mappedProps);
        let tempCustomMap: { [key: string]: string } = { ...this.customMap };
        if (currentCustomMap) {
            const m = this._propertiesMapper.mapValues(currentCustomMap);
            tempCustomMap = { ...tempCustomMap, ...m };
        }

        let hasMap = false;

        Object.keys(tempCustomMap).forEach(key => {
            if (keys.includes(key)) {
                customMap[key] = tempCustomMap[key];
                hasMap = true;
            }

        });

        return hasMap ? customMap : undefined;
    }

    private getMappedPageViewInfo(
        pageTitle?: string,
        pageViewInfo?: PageViewInfo,
        excludeKeys: (keyof PageViewInfo)[]
            = ['name', 'uri', 'customMap', 'measurements', 'properties']): { [key: string]: any } {
        let extraProps = this._propertiesMapper.mapKeys(pageViewInfo, excludeKeys);
        if (pageViewInfo && pageViewInfo.properties) {
            const nestedProps = this._propertiesMapper.mapKeys(pageViewInfo.properties);
            extraProps = { ...nestedProps, ...extraProps };
        }

        const measurements = pageViewInfo && pageViewInfo.measurements ?
            this._propertiesMapper.mapKeys(pageViewInfo.measurements) : undefined;

        const props: { [key: string]: any } = {
            ...extraProps,
            ...measurements
        };

        pageTitle = pageTitle ? pageTitle : pageViewInfo && pageViewInfo.name ? pageViewInfo.name : undefined;
        if (pageTitle) {
            props.page_title = pageTitle;
        }

        const uri = pageViewInfo && pageViewInfo.uri ? pageViewInfo.uri : undefined;
        if (uri) {
            if (uri.startsWith('/')) {
                props.page_path = uri;
            } else {
                props.page_location = uri;
            }
        }

        if (this.userId) {
            props.user_id = this.userId;
        }
        if (this.accountId) {
            props.account_id = this.accountId;
        }

        return props;
    }

    private getMappedEventInfo(
        eventInfo?: EventTimingInfo,
        excludeKeys: (keyof EventInfo)[]
            = ['name', 'customMap', 'measurements', 'properties']): { [key: string]: any } {
        let extraProps = this._propertiesMapper.mapKeys(eventInfo, excludeKeys);
        if (eventInfo && eventInfo.properties) {
            const nestedProps = this._propertiesMapper.mapKeys(eventInfo.properties);
            extraProps = { ...nestedProps, ...extraProps };
        }

        const measurements = eventInfo && eventInfo.measurements ?
            this._propertiesMapper.mapKeys(eventInfo.measurements) : undefined;

        const props: { [key: string]: any } = {
            ...extraProps,
            ...measurements
        };

        if (this.userId) {
            props.user_id = this.userId;
        }
        if (this.accountId) {
            props.account_id = this.accountId;
        }

        return props;
    }

    private getMappedLogInfo(
        logInfo?: LogInfo,
        excludeKeys: (keyof LogInfo)[]
            = ['customMap', 'measurements', 'properties']): { [key: string]: any } {
        let extraProps = this._propertiesMapper.mapKeys(logInfo, excludeKeys);
        if (logInfo && logInfo.properties) {
            const nestedProps = this._propertiesMapper.mapKeys(logInfo.properties);
            extraProps = { ...nestedProps, ...extraProps };
        }

        const measurements = logInfo && logInfo.measurements ?
            this._propertiesMapper.mapKeys(logInfo.measurements) : undefined;

        const props: { [key: string]: any } = {
            ...extraProps,
            ...measurements
        };

        if (this.userId) {
            props.user_id = this.userId;
        }
        if (this.accountId) {
            props.account_id = this.accountId;
        }

        return props;
    }
}
