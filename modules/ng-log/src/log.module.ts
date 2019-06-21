/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { LogService } from './log.service';
import { LOGGING_CONFIG, LoggingConfig } from './logging-config';

/**
 * The main `NGMODULE` for providing `LogService`.
 */
@NgModule({
    providers: [
        LogService
    ]
})
export class LogModule {
    static withConfig(config: LoggingConfig): ModuleWithProviders {
        return {
            ngModule: LogModule,
            providers: [
                {
                    provide: LOGGING_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
