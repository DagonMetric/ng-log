/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { LoggerProvider } from '@dagonmetric/ng-log';

import {
    APPLICATIONINSIGHTS_LOGGER_OPTIONS,
    ApplicationInsightsLoggerOptions,
    ApplicationInsightsLoggerProvider
} from './applicationinsights-logger-provider';

/**
 * The `NGMODULE` for providing `LoggerProvider` with `ApplicationInsightsLoggerProvider`.
 */
@NgModule({
    providers: [
        {
            provide: LoggerProvider,
            useClass: ApplicationInsightsLoggerProvider,
            multi: true
        }
    ]
})
export class ApplicationInsightsWebLoggerModule {
    /**
     * Call this method to provide options for configuring the `ApplicationInsightsLoggerProvider`.
     * @param options An option object for `ApplicationInsightsLoggerProvider`.
     */
    static withOptions(options: ApplicationInsightsLoggerOptions): ModuleWithProviders {
        return {
            ngModule: ApplicationInsightsWebLoggerModule,
            providers: [
                {
                    provide: APPLICATIONINSIGHTS_LOGGER_OPTIONS,
                    useValue: options
                }
            ]
        };
    }
}
