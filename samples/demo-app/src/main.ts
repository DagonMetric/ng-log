/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';

import { AppModule } from './app/app.module';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then((ref) => {
        if (!environment.production && typeof window !== 'undefined') {
            // Ensure Angular destroys itself on hot reloads.
            if ((window as any).ngRef) {
                (window as any).ngRef.destroy();
            }
            (window as any).ngRef = ref;
        }
    })
    .catch((err) => console.error(err));
