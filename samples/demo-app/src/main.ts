/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import './polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then((ref) => {
        if (typeof window !== 'undefined') {
            // Ensure Angular destroys itself on hot reloads.
            if ((window as any).ngRef) {
                (window as any).ngRef.destroy();
            }
            (window as any).ngRef = ref;
        }
    })
    .catch((err) => console.error(err));
