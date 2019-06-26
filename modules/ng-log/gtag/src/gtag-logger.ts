/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable: no-any

import { EventInfo, EventInfoBase, Logger, LogLevel, PageViewInfo } from '@dagonmetric/ng-log';

import { GTag } from './gtag';
import { GTagPropertiesMapper } from './gtag-properties-mapper';

/**
 * Google global site tag logger implementation for `Logger`.
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

    log(logLevel: LogLevel, message?: string | Error, optionalParams?: any): void {
        if (!this._gtag || !this.measurementId || logLevel === LogLevel.None) {
            return;
        }

        const params = optionalParams && typeof optionalParams === 'object' ?
            optionalParams as { [key: string]: any } : undefined;
        const mappedProps = this._propertiesMapper.mapKeys(params, ['customMap', 'measurements']);

        if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            const exceptionProps = {
                description: message,
                fatal: logLevel === LogLevel.Critical
            };

            if (params && params.customMap) {
                const measurementId = params.sendTo && typeof params.sendTo === 'string' ? params.sendTo : this.measurementId;
                const customMap = this._propertiesMapper.mapValues(params.customMap as { [name: string]: string });

                this._gtag('config', measurementId, {
                    custom_map: customMap
                });

                const measurements = this._propertiesMapper.mapKeys(params.measurements as { [name: string]: number });

                this._gtag('event', 'exception', {
                    ...mappedProps,
                    ...measurements,
                    ...exceptionProps
                });
            } else {
                this._gtag('event', 'exception', {
                    ...mappedProps,
                    ...exceptionProps
                });
            }
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
                message,
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

        if (name == null && typeof window === 'object' && window.document) {
            name = window.document && window.document.title || '';
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

    stopTrackPage(name?: string, properties?: PageViewInfo): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        if (name == null && typeof window === 'object' && window.document) {
            name = window.document && window.document.title || '';
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

        const pageViewProps = this.getMappedPageViewInfo(name, properties);
        if (properties && properties.sendTo) {
            pageViewProps.send_to = properties.sendTo;
        }

        this._gtag('event', 'timing_complete', {
            ...pageViewProps,
            name,
            value: duration
        });

        this._eventTiming.delete(name);
    }

    trackPageView(name?: string, properties?: PageViewInfo): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        const pageViewProps = this.getMappedPageViewInfo(name, properties);

        const measurementId = properties && properties.sendTo ? properties.sendTo : this.measurementId;
        this._gtag('config', measurementId, pageViewProps);
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

    stopTrackEvent(name: string, properties?: EventInfo): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        const start = this._eventTiming.get(name);
        if (start == null || isNaN(start)) {
            console.error(`The 'stopTrackEvent' was called without a corresponding start, name: ${name}.`);

            return;
        }

        const duration = GTagLogger.getDuration(start);

        const mappedProps = this.getMappedEventInfo(properties);

        const customMap = properties && properties.customMap ? { ...this.customMap, ...properties.customMap } : { ...this.customMap };
        if (Object.keys(customMap).length > 0) {
            this._gtag('config', mappedProps.send_to || this.measurementId, {
                custom_map: this._propertiesMapper.mapValues(customMap)
            });
        }

        this._gtag('event', 'timing_complete', {
            ...mappedProps,
            name,
            value: duration
        });

        this._eventTiming.delete(name);
    }

    trackEvent(name: string, properties?: EventInfo): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        const mappedProps = this.getMappedEventInfo(properties);

        const customMap = properties && properties.customMap ? { ...this.customMap, ...properties.customMap } : { ...this.customMap };
        if (Object.keys(customMap).length > 0) {
            this._gtag('config', mappedProps.send_to || this.measurementId, {
                custom_map: this._propertiesMapper.mapValues(customMap)
            });
        }

        this._gtag('event', name, mappedProps);
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

    private getMappedPageViewInfo(
        name?: string,
        properties?: PageViewInfo,
        excludeKeys: (keyof EventInfoBase)[] = ['customMap', 'measurements', 'sendTo']): { [key: string]: any } {
        const mappedProps = this._propertiesMapper.mapKeys(properties, excludeKeys) || {};

        if (name) {
            mappedProps.page_title = name;
        }

        if (this.userId) {
            mappedProps.user_id = this.userId;
        }
        if (this.accountId) {
            mappedProps.account_id = this.accountId;
        }

        const customMap = properties && properties.customMap ? { ...this.customMap, ...properties.customMap } : { ...this.customMap };
        if (Object.keys(customMap).length > 0) {
            mappedProps.custom_map = this._propertiesMapper.mapValues(customMap);
        }

        const measurements = properties && properties.measurements ? this._propertiesMapper.mapKeys(properties.measurements) : undefined;

        return {
            ...mappedProps,
            ...measurements
        };
    }

    private getMappedEventInfo(
        properties?: EventInfo,
        excludeKeys: (keyof EventInfoBase)[] = ['customMap', 'measurements']): { [key: string]: any } {
        const mappedProps = this._propertiesMapper.mapKeys(properties, excludeKeys) || {};

        if (this.userId) {
            mappedProps.user_id = this.userId;
        }
        if (this.accountId) {
            mappedProps.account_id = this.accountId;
        }

        if (properties && properties.value && typeof properties.value === 'string') {
            const parsed = parseInt(properties.value, 10);
            mappedProps.value = isNaN(parsed) ? 0 : parsed;
        }

        const measurements = properties && properties.measurements ? this._propertiesMapper.mapKeys(properties.measurements) : undefined;

        return {
            ...mappedProps,
            ...measurements
        };
    }
}
