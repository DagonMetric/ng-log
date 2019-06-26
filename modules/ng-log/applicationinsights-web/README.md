# ApplicationInsightsWebLoggerModule

[Microsoft Application Insights](https://github.com/microsoft/ApplicationInsights-JS) implementation for [Logger](https://github.com/DagonMetric/ng-log/blob/master/modules/ng-log/src/logger.ts).

## Getting Started

### Prerequisites

The following npm packages are required before using this module.

* @angular/common >= v8.0.0-beta.0
* @angular/core >= v8.0.0-beta.0
* @dagonmetric/ng-log >= v2.0.0
* @microsoft/applicationinsights-web >= v2.0.1

### Module Setup (app.module.ts)

```typescript
import { LogModule } from '@dagonmetric/ng-log';
import { ApplicationInsightsWebLoggerModule } from '@dagonmetric/ng-log/applicationinsights-web';

@NgModule({
  imports: [
    // Other module imports

    // ng-log module
    LogModule,
    ApplicationInsightsWebLoggerModule.withOptions({
      instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE'
      /* ...Other Configuration Options... */
    })
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
    this._logService.error(new Error('Testing error'));
    this._logService.fatal(new Error('Testing critical'));

    // Track page view
    this._logService.trackPageView({
      name: 'My Angular App',
      uri: '/home'
    });

    // Track page view with timing
    this._logService.startTrackPage('about');
    this._logService.stopTrackPage('about', { uri: '/about' });

    // Track custom event
    this._logService.trackEvent({
      name: 'video_auto_play_start',
      eventLabel: 'My promotional video',
      eventCategory: 'video_auto_play',
      properties: {
        nonInteraction: true
      }
    });

    // Track custom event with metrics
    this._logService.trackEvent({
      name: 'foo',
      measurements: {
        avgPageLoadTime: 1
      },
      properties: {
        age: 12
      }
    });

    // Track custom event with timing
    this._logService.startTrackEvent('video_auto_play');
    this._logService.stopTrackEvent('video_auto_play', {
      eventLabel: 'My promotional video',
      eventCategory: 'video_auto_play',
      properties: {
        nonInteraction: true
      }
    });

    // Set user properties
    this._logService.setUserProperties('<Authenticated User Id>', '<Account Id>');

    // Clear user properties
    this._logService.clearUserProperties();
  }
}
```

For more configuring information, see [ApplicationInsightsWebLoggerModule wiki](https://github.com/DagonMetric/ng-log/wiki/ApplicationInsightsWebLoggerModule).

