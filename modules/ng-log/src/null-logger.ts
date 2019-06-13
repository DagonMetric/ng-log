/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { LogLevel } from './log-level';
import { Logger } from './logger';

/**
 * The null logger implementation for `Logger`.
 */
export class NullLogger implements Logger {
    log(_: LogLevel): void {
        // Do nothing
    }

    trace(): void {
        // Do nothing
    }

    debug(): void {
        // Do nothing
    }

    info(): void {
        // Do nothing
    }

    warn(): void {
        // Do nothing
    }

    error(): void {
        // Do nothing
    }

    isEnabled(): boolean {
        return false;
    }
}
