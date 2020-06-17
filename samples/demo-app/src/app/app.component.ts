import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { LogService, Logger } from '@dagonmetric/ng-log';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy {
    private readonly logger: Logger;

    constructor(private readonly logService: LogService) {
        // Create a child logger named 'AppComponent'
        this.logger = this.logService.createLogger('app');
    }

    logTrace(): void {
        this.logger.trace('Testing trace');
    }

    logDebug(): void {
        this.logger.debug('Testing debug');
    }

    logInfo(): void {
        this.logger.info('Testing info');
    }

    logWarn(): void {
        this.logger.warn('Testing warn');
    }

    logError(): void {
        this.logger.error(new Error('Testing error'));
    }

    logFatal(): void {
        this.logger.fatal(new Error('Testing critical'));
    }

    trackPageView(): void {
        // Track page view
        this.logger.trackPageView({
            name: 'My Angular App',
            uri: '/home'
        });
    }

    trackEvent(): void {
        this.logger.trackEvent({
            name: 'video_auto_play_start',
            properties: {
                non_interaction: true
            }
        });
    }

    ngOnDestroy(): void {
        // Destroy child logger
        this.logService.destroyLogger('app');
    }
}
