# LogConfigModule

The `NGMODULE` for setting logging configuration with `ConfigService`.

## Getting Started

### Prerequisite

* @angular/core >= v8.0.0-beta.0
* @dagonmetric/ng-config >= v2.1.0
* @dagonmetric/ng-log >= v2.1.0

### Module Setup (app.module.ts)

```typescript
import { ConfigModule } from '@dagonmetric/ng-config';
import { HttpConfigLoaderModule } from '@dagonmetric/ng-config/http-loader';
import { LogModule } from '@dagonmetric/ng-log';
import { LogConfigModule } from '@dagonmetric/ng-log/config';

@NgModule({
  imports: [
    // Other module imports

    // ng-config modules
    ConfigModule.init(),
    HttpConfigLoaderModule.withOptions({
        endpoint: '/appsettings.json'
    }),

    // ng-log modules
    LogModule,
    LogConfigModule
  ]
})
export class AppModule { }
```

For more configuring information, see [LogConfigModule wiki](https://github.com/DagonMetric/ng-log/wiki/LogConfigModule).
