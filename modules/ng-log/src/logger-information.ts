/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { LogLevel } from './log-level';
import { Logger } from './logger';

export interface LoggerInformation {
    logger: Logger;
    category: string;
    providerType: string;
    minLevel?: LogLevel;
    event?: { [name: string]: boolean };
    pageView?: boolean;
}
