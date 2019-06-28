// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { LOG_CONFIG, LogConfig } from '../src/log-config';
import { LogModule } from '../src/log.module';
import { LogService } from '../src/log.service';

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

            const config = TestBed.get<LogConfig>(LOG_CONFIG);

            expect(config).toBeDefined();
            expect((config as LogConfig).minLevel).toBe('info');
        });
    });
});
