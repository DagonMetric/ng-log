/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { LoggerProvider } from '@dagonmetric/ng-log';

import { CONSOLE_LOGGER_OPTIONS, ConsoleLoggerOptions, ConsoleLoggerProvider } from './console-logger-provider';

/**
 * The `NGMODULE` for providing `LoggerProvider` with `ConsoleLoggerProvider`.
 */
@NgModule({
    providers: [
        {
            provide: LoggerProvider,
            useClass: ConsoleLoggerProvider,
            multi: true
        }
    ]
})
export class ConsoleLoggerModule {
    /**
     * Call this method to provide options for configuring the `ConsoleLoggerProvider`.
     * @param options An option object for 'ConsoleLoggerProvider'.
     */
    static withOptions(options: ConsoleLoggerOptions): ModuleWithProviders {
        return {
            ngModule: ConsoleLoggerModule,
            providers: [
                {
                    provide: CONSOLE_LOGGER_OPTIONS,
                    useValue: options
                }
            ]
        };
    }
}
