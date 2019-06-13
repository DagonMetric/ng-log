/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

import { Logger } from './logger';

export interface LoggerProvider {
    readonly name: string;
    createLogger(category: string): Logger;
}

export const LOGGER_PROVIDER = new InjectionToken<LoggerProvider>('LoggerProvider');
