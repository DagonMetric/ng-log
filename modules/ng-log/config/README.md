# LogConfigModule

The `NGMODULE` for setting logging configuration with `ConfigService`.

## Getting Started

### Module Setup (app.module.ts)

```typescript
import { ConfigModule } from '@dagonmetric/ng-config';
import { HttpConfigLoaderModule } from '@dagonmetric/ng-config/http-loader';
import { LogModule } from '@dagonmetric/ng-log';
import { LogConfigModule } from '@dagonmetric/ng-log/config';

@NgModule({
  imports: [
    // Other module imports

    // ng-config module
    ConfigModule.init(),
    HttpConfigLoaderModule.withOptions({
        endpoint: '/appsettings.json'
    }),

    // ng-log module
    LogModule,
    LogConfigModule
  ]
})
export class AppModule { }
```

For more configuring information, see [LogConfigModule wiki](https://github.com/DagonMetric/ng-log/wiki/LogConfigModule).
