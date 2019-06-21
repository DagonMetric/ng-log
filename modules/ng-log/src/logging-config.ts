/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

import { LogLevelString } from './log-level';

export interface LogLevelSection {
    [categoryName: string]: LogLevelString;
}

export interface PageViewSection {
    [categoryName: string]: boolean;
}

export interface EventSection {
    [categoryName: string]: { [eventName: string]: boolean };
}

export interface LoggerSection {
    logLevel?: LogLevelSection | LogLevelString;
    pageView?: PageViewSection | boolean;
    event?: EventSection | { [eventName: string]: boolean };
}

export interface LoggingConfigBase {
    minLevel?: LogLevelString;
    logLevel?: LogLevelSection;
    pageView?: PageViewSection | boolean;
    event?: EventSection | { [eventName: string]: boolean };
    userId?: boolean;
}

export interface LoggingConfig extends LoggingConfigBase {
    [name: string]: LoggerSection | LogLevelSection | EventSection | PageViewSection | LogLevelString | boolean | undefined;
}

export const LOGGING_CONFIG = new InjectionToken<LoggingConfig>('LoggingConfig');
