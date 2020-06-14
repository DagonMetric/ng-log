import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { LogService, Logger } from '@dagonmetric/ng-log';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
    private readonly logger: Logger;

    constructor(private readonly logService: LogService) {
        // Create a child logger named 'AppComponent'
        this.logger = this.logService.createLogger(AppComponent.name);
    }

    ngOnInit(): void {
        // Track traces
        this.logger.trace('Testing trace');
        this.logger.debug('Testing debug');
        this.logger.info('Testing info');
        this.logger.warn('Testing warn');

        // Track exceptions
        this.logger.error(new Error('Testing error'));
        this.logger.fatal(new Error('Testing critical'));

        // Track page view
        this.logger.trackPageView({
            name: 'My Angular App',
            uri: '/home'
        });

        // Track custom event
        this.logger.trackEvent({
            name: 'video_auto_play_start',
            properties: {
                non_interaction: true
            }
        });
    }

    ngOnDestroy(): void {
        // Destroy child logger
        this.logService.destroyLogger(AppComponent.name);
    }
}
