# LogConfigModule

The `NGMODULE` for setting logging configuration with `ConfigService`.

## Getting Started

### Prerequisite

* @dagonmetric/ng-config >= v4.0.0
* @dagonmetric/ng-log >= v3.0.0

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
    ConfigModule.configure(),
    HttpConfigProviderModule.configure({
        endpoint: '/api/configuration'
    }),

    // ng-log modules
    LogModule,
    LogConfigModule
  ]
})
export class AppModule { }
```
