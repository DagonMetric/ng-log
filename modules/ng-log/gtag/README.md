# GTagLoggerModule

Google Global Site Tag (gtag.js) implementation for [LoggingApi](https://github.com/DagonMetric/ng-log/blob/master/modules/ng-log/src/logging-api.ts).

## Getting Started

### Install the global site tag

Add gtag.js to your site from [developers.google.com/analytics/devguides/collection/gtagjs](https://developers.google.com/analytics/devguides/collection/gtagjs/).

### Module Setup (app.module.ts)

```typescript
import { LogModule } from '@dagonmetric/ng-log';
import { GTagLoggerModule } from '@dagonmetric/ng-log/gtag';

@NgModule({
  imports: [
    // Other module imports

    // ng-log module
    LogModule.withConfig({ minLevel: 'debug' }),
    GTagLoggerModule.withOptions({ measurementId: 'GA_MEASUREMENT_ID' })
  ]
})
export class AppModule { }
```

### Usage (app.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';

import { LogService } from '@dagonmetric/ng-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private readonly _logService: LogService) { }

  ngOnInit(): void {
    // Track traces
    this._logService.trace('Testing trace');
    this._logService.debug('Testing debug');
    this._logService.info('Testing info');
    this._logService.warn('Testing warn');

    // Track exceptions
    this._logService.error('Testing error');
    this._logService.fatal(new Error('Testing critical'));

    // Track page view
    this._logService.trackPageView('My Angular App', { pagePath: '/home' });

    // Track page view with timing
    this._logService.startTrackPage('about');
    this._logService.stopTrackPage('about', { pagePath: '/about' });

    // Track custom event
    this._logService.trackEvent('video_auto_play_start', {
      eventLabel: 'My promotional video',
      eventCategory: 'video_auto_play',
      nonInteraction: true
    });

    // Track custom event with dimensions and metrics
    this._logService.trackEvent('foo', {
      customMap: {
        dimension2: 'age',
        metric5: 'avgPageLoadTime'
      },
      age: 12,
      measurements: {
        avgPageLoadTime: 1
      }
    });

    // Track custom event with timing
    this._logService.startTrackEvent('video_auto_play');
    this._logService.stopTrackEvent('video_auto_play', {
      eventLabel: 'My promotional video',
      eventCategory: 'video_auto_play',
      nonInteraction: true
    });

    // Set user properties
    this._logService.setUserProperties('<Authenticated User Id>', '<Account Id>');

    // Clear user properties
    this._logService.clearUserProperties();
  }
}
```

For more configuring information, see [GTagLoggerModule wiki](https://github.com/DagonMetric/ng-log/wiki/GTagLoggerModule).
