/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { NgModule } from '@angular/core';

import { ConfigService } from '@dagonmetric/ng-config';
import { LOG_CONFIG, LogConfig } from '@dagonmetric/ng-log';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function logConfigFactory(configService: ConfigService): LogConfig {
    const loggingSection = configService.getValue('logging');

    return loggingSection as LogConfig;
}

/**
 * The `NGMODULE` for setting logging configuration with `ConfigService`.
 */
@NgModule({
    providers: [
        {
            provide: LOG_CONFIG,
            useFactory: logConfigFactory,
            deps: [ConfigService]
        }
    ]
})
export class LogConfigModule {}
