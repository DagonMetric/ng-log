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
    userId?: boolean;
}

export interface LogConfigBase {
    minLevel?: LogLevelString;
    logLevel?: LogLevelSection;
    pageView?: PageViewSection | boolean;
    event?: EventSection | { [eventName: string]: boolean };
    userId?: boolean;
}

export interface LogConfig extends LogConfigBase {
    [name: string]:
        | LoggerSection
        | LogLevelSection
        | EventSection
        | PageViewSection
        | LogLevelString
        | boolean
        | undefined;
}

export const LOG_CONFIG = new InjectionToken<LogConfig>('LogConfig');
