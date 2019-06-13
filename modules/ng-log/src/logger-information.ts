/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { LogLevel } from './log-level';
import { Logger } from './logger';

export type FilterFunc = (providerType: string, category: string, logLevel: LogLevel) => boolean;

export interface LoggerInformation {
    logger: Logger;
    category: string;
    providerType: string;
    minLevel?: LogLevel;
    filter?(providerType: string, category: string, level: LogLevel): boolean;
}
