import { InjectionToken } from '@angular/core';

import { Logger } from './logger';

export interface LoggerProvider {
    readonly name: string;
    createLogger(category: string): Logger;
}

export const LOGGER_PROVIDER = new InjectionToken<LoggerProvider>('LoggerProvider');
