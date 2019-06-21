// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { LogModule } from '../src/log.module';
import { LogService } from '../src/log.service';
import { LOGGING_CONFIG, LoggingConfig } from '../src/logging-config';

describe('LogModule', () => {
    it("should provide 'LogService' instance", () => {
        TestBed.configureTestingModule({
            imports: [
                LogModule
            ]
        });

        const logService = TestBed.get<LogService>(LogService);

        expect(logService).toBeDefined();
    });

    describe('withConfig', () => {
        it("should provide 'LOG_OPTIONS' value", () => {
            TestBed.configureTestingModule({
                imports: [
                    LogModule.withConfig({
                        minLevel: 'info'
                    })
                ]
            });

            const config = TestBed.get<LoggingConfig>(LOGGING_CONFIG);

            expect(config).toBeDefined();
            expect((config as LoggingConfig).minLevel).toBe('info');
        });
    });
});
