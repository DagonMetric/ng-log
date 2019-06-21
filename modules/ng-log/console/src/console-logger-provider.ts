/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Injectable } from '@angular/core';

import { Logger, LoggerProvider } from '@dagonmetric/ng-log';

import { ConsoleLogger } from './console-logger';

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

    setAuthenticatedUserContext(): void {
        // Do nothing
    }

    clearAuthenticatedUserContext(): void {
        // Do nothing
    }
}
