ng-logging-configuration
=====================

Installation
---------------

```bash
npm install @dagonmetric/ng-logging-configuration
```

Setup
---------------

```typescript
import { LoggerModule } from '@dagonmetric/ng-logging';
import { LoggingConfigurationModule } from '@dagonmetric/ng-logging-configuration';

@NgModule({
    imports: [
        // Other module imports

        // Logging
        LoggerModule,
        LoggingConfigurationModule
    ]
})
export class AppModule { }
```