/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

import { Logger, LoggingApi } from './logger';

/**
 * The logger provider interface.
 */
export interface LoggerProvider extends LoggingApi {
    readonly name: string;
    createLogger(category: string): Logger;
    setUserProperties?(userId: string, accountId?: string): void;
    clearUserProperties?(): void;
    destroyLogger?(category: string): void;
}

export const LOGGER_PROVIDER = new InjectionToken<LoggerProvider>('LoggerProvider');
