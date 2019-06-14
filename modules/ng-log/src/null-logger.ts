/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Logger } from './logger';

/**
 * The internal null logger implementation for `Logger`.
 */
export class NullLogger implements Logger {
    log(): void {
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

    fatal(): void {
        // Do nothing
    }

    startTrackPage(): void {
        // Do nothing
    }

    stopTrackPage(): void {
        // Do nothing
    }

    trackPageView(): void {
        // Do nothing
    }

    startTrackEvent(): void {
        // Do nothing
    }

    stopTrackEvent(): void {
        // Do nothing
    }

    trackEvent(): void {
        // Do nothing
    }

    setAuthenticatedUserContext(): void {
        // Do nothing
    }

    clearAuthenticatedUserContext(): void {
        // Do nothing
    }

    flush(): void {
        // Do nothing
    }
}
