import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ConsoleLoggerProvider } from './console-logger-provider';
import { LOGGER_PROVIDER } from './logger-provider';

@NgModule({
    providers: [
        {
            provide: LOGGER_PROVIDER,
            useClass: ConsoleLoggerProvider,
            multi: true
        }
    ]
})
export class ConsoleLoggerModule {
    constructor(@Optional() @SkipSelf() parentModule: ConsoleLoggerModule) {
        if (parentModule) {
            throw new Error('ConsoleLoggerModule has already been loaded, import in root module only.');
        }
    }
}
