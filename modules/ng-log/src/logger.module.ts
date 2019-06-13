/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { LoggerFactory } from './logger-factory';
import { LOGGER_CONFIG, LoggerConfig, LoggerFilterOptions } from './logger-options';

/**
 * The main `NGMODULE` for providing `LoggerFactory`.
 */
@NgModule({
    providers: [
        LoggerFactory
    ]
})
export class LoggerModule {
    static withOptions(options: LoggerFilterOptions | LoggerConfig): ModuleWithProviders {
        return {
            ngModule: LoggerModule,
            providers: [
                {
                    provide: LOGGER_CONFIG,
                    useValue: options
                }
            ]
        };
    }
}
