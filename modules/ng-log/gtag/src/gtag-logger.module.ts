/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { LOGGER_PROVIDER } from '@dagonmetric/ng-log';

import { GTAG_LOGGER_OPTIONS, GTagLoggerOptions, GTagLoggerProvider } from './gtag-logger-provider';

/**
 * The `NGMODULE` for providing `LOGGER_PROVIDER` with `GTagLoggerProvider`.
 */
@NgModule({
    providers: [
        {
            provide: LOGGER_PROVIDER,
            useClass: GTagLoggerProvider,
            multi: true
        }
    ]
})
export class GTagLoggerModule {
    /**
     * Call this method to provide options for configuring the `GTagLoggerProvider`.
     * @param options An option object for `GTagLoggerProvider`.
     */
    static withOptions(options: GTagLoggerOptions): ModuleWithProviders {
        return {
            ngModule: GTagLoggerModule,
            providers: [
                {
                    provide: GTAG_LOGGER_OPTIONS,
                    useValue: options
                }
            ]
        };
    }
}
