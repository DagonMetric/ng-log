import { LogLevel } from './log-level';
import { Logger } from './logger';

export class NullLogger implements Logger {
    log(_: LogLevel): void {
        // Do nothing
    }

    trace(): void {
        // Do nothing
    }

    debug(): void {
        // Do nothing
    }

    info(): void {
        // Do nothing
    }

    warn(): void {
        // Do nothing
    }

    error(): void {
        // Do nothing
    }

    isEnabled(): boolean {
        return false;
    }
}
