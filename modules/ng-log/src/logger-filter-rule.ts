/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { LogLevel } from './log-level';

export interface LoggerFilterRule {
    providerName?: string | null;
    categoryName?: string | null;
    logLevel: LogLevel;
}
