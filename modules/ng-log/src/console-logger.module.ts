/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { NgModule } from '@angular/core';

import { ConsoleLoggerProvider } from './console-logger-provider';
import { LOGGER_PROVIDER } from './logger-provider';

/**
 * The `NGMODULE` for providing `LOGGER_PROVIDER` with `ConsoleLoggerProvider`.
 */
@NgModule({
    providers: [
        {
            provide: LOGGER_PROVIDER,
            useClass: ConsoleLoggerProvider,
            multi: true
        }
    ]
})
export class ConsoleLoggerModule { }
