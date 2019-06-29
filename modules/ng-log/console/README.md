# ConsoleLoggerModule

Console logging implementation for [Logger](https://github.com/DagonMetric/ng-log/blob/master/modules/ng-log/src/logger.ts).

## Getting Started

### Module Setup (app.module.ts)

```typescript
import { LogModule } from '@dagonmetric/ng-log';
import { ConsoleLoggerModule } from '@dagonmetric/ng-log/console';

@NgModule({
  imports: [
    // Other module imports

    // ng-log modules
    LogModule.withConfig({ minLevel: 'debug' }),
    ConsoleLoggerModule
  ]
})
export class AppModule { }
```

For more configuring information, see [ConsoleLoggerModule wiki](https://github.com/DagonMetric/ng-log/wiki/ConsoleLoggerModule).
