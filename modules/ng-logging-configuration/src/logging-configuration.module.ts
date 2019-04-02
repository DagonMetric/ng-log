// tslint:disable:no-unsafe-any

import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ConfigService } from '@dagonmetric/ng-config';
import { LoggerFactory } from '@dagonmetric/ng-logging';

@NgModule()
export class LoggingConfigurationModule {
    constructor(configService: ConfigService,
        loggerFactory: LoggerFactory,
        @Optional() @SkipSelf() parentModule: LoggingConfigurationModule) {
        if (parentModule) {
            throw new Error('LoggingConfigurationModule has already been loaded, import in root module only.');
        }

        configService.loadEvent
            .subscribe((evt) => {
                if (evt.loaded && !evt.loading && evt.data.logging) {
                    loggerFactory.setConfig(evt.data.logging);
                }
            });
    }
}
