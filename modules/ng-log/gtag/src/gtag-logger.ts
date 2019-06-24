/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable: no-any

import { EventInfo, Logger, LogLevel, PageViewInfo } from '@dagonmetric/ng-log';

import { GTag } from './gtag';
import { GTagPropertiesMapper } from './gtag-properties-mapper';

/**
 * Google global site tag logger implementation for `Logger`.
 */
export class GTagLogger extends Logger {
    measurementId?: string;

    private readonly _eventTiming: Map<string, number> = new Map<string, number>();

    constructor(
        readonly name: string,
        private readonly _propertiesMapper: GTagPropertiesMapper,
        private readonly _gtag?: GTag,
        measurementId?: string) {
        super();
        this.measurementId = measurementId;
    }

    log(logLevel: LogLevel, message?: string | Error, optionalParams?: any): void {
        if (!this._gtag || !this.measurementId || logLevel === LogLevel.None) {
            return;
        }

        const additionalProps = optionalParams && typeof optionalParams === 'object' ?
            optionalParams as { [key: string]: any } : undefined;

        if (logLevel === LogLevel.Error || logLevel === LogLevel.Critical) {
            const exceptionProps = {
                description: message,
                fatal: logLevel === LogLevel.Critical
            };

            if (additionalProps && additionalProps.customMap) {
                const measurementId = (additionalProps.sendTo || this.measurementId) as string;
                const customMap = this._propertiesMapper.mapValues(additionalProps.customMap as { [name: string]: string });

                this._gtag('config', measurementId, {
                    custom_map: customMap
                });

                const measurements = this._propertiesMapper.mapKeys(additionalProps.measurements as { [name: string]: number });

                const properties = this._propertiesMapper.mapKeys(additionalProps, ['customMap', 'measurements']);

                this._gtag('event', 'exception', {
                    ...properties,
                    ...exceptionProps,
                    ...measurements
                });
            } else {
                this._gtag('event', 'exception', exceptionProps);
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

            const properties = this._propertiesMapper.mapKeys(additionalProps, ['customMap', 'measurements']);

            this._gtag('event', 'trace', {
                ...properties,
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

        const duration = this.getDuration(start);
        const pageViewInfo = {
            page_title: name,
            page_path: properties && properties.pagePath ? properties.pagePath : undefined,
            page_location: properties && properties.pageLocation ? properties.pageLocation : undefined
        };

        if (properties && (properties.sendTo || properties.customMap)) {
            const measurementId = properties.sendTo || this.measurementId;
            if (properties.customMap) {
                const customMap = this._propertiesMapper.mapValues(properties.customMap);

                this._gtag('config', measurementId, {
                    custom_map: customMap
                });
            }

            const measurements = this._propertiesMapper.mapKeys(properties.measurements);

            this._gtag('event', 'timing_complete', {
                ...pageViewInfo,
                ...measurements,
                name,
                value: duration
            });
        } else {
            this._gtag('event', 'timing_complete', {
                ...pageViewInfo,
                name,
                value: duration
            });
        }

        this._eventTiming.delete(name);
    }

    trackPageView(name?: string, properties?: PageViewInfo): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        const pageViewInfo = {
            page_title: name,
            page_path: properties && properties.pagePath ? properties.pagePath : undefined,
            page_location: properties && properties.pageLocation ? properties.pageLocation : undefined
        };

        if (properties && (properties.sendTo || properties.customMap)) {
            const measurementId = properties.sendTo || this.measurementId;
            if (properties.customMap) {
                const customMap = this._propertiesMapper.mapValues(properties.customMap);

                this._gtag('config', measurementId, {
                    custom_map: customMap
                });
            }

            const measurements = this._propertiesMapper.mapKeys(properties.measurements);

            this._gtag('event', 'page_view', {
                ...pageViewInfo,
                ...measurements,
                send_to: properties.sendTo
            });
        } else {
            this._gtag('config', this.measurementId, properties ? pageViewInfo : undefined);
        }
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

        const duration = this.getDuration(start);
        const mappedProps = this._propertiesMapper.mapKeys(properties, ['customMap', 'measurements']);

        if (properties && properties.customMap) {
            const measurementId = properties.sendTo || this.measurementId;
            const customMap = this._propertiesMapper.mapValues(properties.customMap);

            this._gtag('config', measurementId, {
                custom_map: customMap
            });

            const measurements = this._propertiesMapper.mapKeys(properties.measurements);

            this._gtag('event', 'timing_complete', {
                ...mappedProps,
                name,
                value: duration,
                ...measurements
            });
        } else {
            this._gtag('event', 'timing_complete', {
                ...mappedProps,
                name,
                value: duration
            });
        }

        this._eventTiming.delete(name);
    }

    trackEvent(name: string, properties?: EventInfo): void {
        if (!this._gtag || !this.measurementId) {
            return;
        }

        const mappedProps = this._propertiesMapper.mapKeys(properties, ['customMap', 'measurements']);

        if (properties && properties.customMap) {
            const measurementId = properties.sendTo || this.measurementId;
            const customMap = this._propertiesMapper.mapValues(properties.customMap);

            this._gtag('config', measurementId, {
                custom_map: customMap
            });

            const measurements = this._propertiesMapper.mapKeys(properties.measurements);

            this._gtag('event', name, {
                ...mappedProps,
                ...measurements
            });
        } else {
            this._gtag('event', name, mappedProps);
        }
    }

    flush(): void {
        // Do nothing
    }

    private getDuration(start: number): number | undefined {
        const end = +new Date();

        let duration: number | undefined;

        if (!(isNaN(start) || isNaN(end))) {
            duration = Math.max(end - start, 0);
        }

        return duration;
    }
}
