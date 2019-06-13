/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@angular/core';

import { ConsoleLogger } from './console-logger';
import { Logger } from './logger';
import { LoggerProvider } from './logger-provider';

/**
 * Logger provider factory for `ConsoleLogger`.
 */
@Injectable({
    providedIn: 'root'
})
export class ConsoleLoggerProvider implements LoggerProvider {
    get name(): string {
        return 'console';
    }

    createLogger(category: string): Logger {
        return new ConsoleLogger(category);
    }
}
