# GTagLoggerModule

GTag implementation for [Logger](https://github.com/DagonMetric/ng-log/blob/master/modules/ng-log/src/logger.ts).

## Getting Started

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

For more configuring information, see [GTagLoggerModule wiki](https://github.com/DagonMetric/ng-log/wiki/GTagLoggerModule).
