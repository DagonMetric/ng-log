/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { LOGGER_PROVIDER } from '@dagonmetric/ng-log';

import {
    APPLICATIONINSIGHTS_LOGGER_OPTIONS,
    ApplicationInsightsLoggerOptions,
    ApplicationInsightsWebLoggerProvider
} from './applicationinsights-web-logger-provider';

/**
 * The `NGMODULE` for providing `LOGGER_PROVIDER` with `ApplicationInsightsWebLoggerProvider`.
 */
@NgModule({
    providers: [
        {
            provide: LOGGER_PROVIDER,
            useClass: ApplicationInsightsWebLoggerProvider,
            multi: true
        }
    ]
})
export class ApplicationInsightsWebLoggerModule {
    /**
     * Call this method to provide options for configuring the `ApplicationInsightsWebLoggerProvider`.
     * @param options An option object for `ApplicationInsightsWebLoggerProvider`.
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
