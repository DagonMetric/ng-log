/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { NgModule } from '@angular/core';

import { ConfigService } from '@dagonmetric/ng-config';
import { LoggingConfig, LogService } from '@dagonmetric/ng-log';

/**
 * The `NGMODULE` for setting logging configuration with `ConfigService`.
 */
@NgModule()
export class LogConfigModule {
    constructor(configService: ConfigService,
        logService: LogService) {
        configService.loadEvent
            .subscribe((evt) => {
                if (evt.status === 'loaded' && evt.data.logging) {
                    logService.setConfig(evt.data.logging as LoggingConfig);
                }
            });
    }
}
