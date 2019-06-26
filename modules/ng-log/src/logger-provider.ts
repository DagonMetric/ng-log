/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

import { Logger } from './logger';
import { LoggingApi } from './logging-api';
import { TrackingApi } from './tracking-api';

export interface LoggerProvider extends LoggingApi, TrackingApi {
    readonly name: string;
    createLogger(category: string): Logger;
    setUserProperties(userId: string, accountId?: string): void;
    clearUserProperties(): void;
}

export const LOGGER_PROVIDER = new InjectionToken<LoggerProvider>('LoggerProvider');
