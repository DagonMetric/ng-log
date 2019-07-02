/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { LOG_CONFIG, LogConfig } from './log-config';
import { LogService } from './log.service';

/**
 * The `NGMODULE` for providing `LogService`.
 */
@NgModule({
    providers: [
        LogService
    ]
})
export class LogModule {
    /**
     * Call this method to provide options for configuring the `LogService`.
     * @param options An option object for `LogService`.
     */
    static withConfig(config: LogConfig): ModuleWithProviders {
        return {
            ngModule: LogModule,
            providers: [
                {
                    provide: LOG_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
