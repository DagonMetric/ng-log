// tslint:disable: no-floating-promises
// tslint:disable: no-console

import { LogLevel } from '../../src/log-level';

import { ConsoleLogger } from '../src/console-logger';

describe('ConsoleLogger', () => {
    let logger: ConsoleLogger;

    beforeEach(() => {
        logger = new ConsoleLogger();
    });

    it("should work with 'trace' method", () => {
        spyOn(console, 'trace');

        const msg = 'This is a trace log.';
        const params = {
            properties: {
                key1: 'value1'
            }
        };

        logger.trace(msg, params);
        expect(console.trace).toHaveBeenCalledWith(msg, params);
    });

    it("should work with 'debug' method", () => {
        spyOn(console, 'debug');

        const msg = 'This is a debug log.';
        const params = {
            properties: {
                key1: 'value1'
            }
        };

        logger.debug(msg, params);
        expect(console.debug).toHaveBeenCalledWith(msg, params);
    });

    it("should work with 'info' method", () => {
        spyOn(console, 'info');

        const msg = 'This is a info log.';
        const params = {
            properties: {
                key1: 'value1'
            }
        };

        logger.info(msg, params);
        expect(console.info).toHaveBeenCalledWith(msg, params);
    });

    it("should work with 'warn' method", () => {
        spyOn(console, 'warn');

        const msg = 'This is a warn.';
        const params = {
            properties: {
                key1: 'value1'
            }
        };

        logger.warn(msg, params);
        expect(console.warn).toHaveBeenCalledWith(msg, params);
    });

    it("should work with 'error' method (string message)", () => {
        spyOn(console, 'error');

        const msg = 'This is an error.';
        const params = {
            properties: {
                key1: 'value1'
            }
        };

        logger.error(msg, params);
        expect(console.error).toHaveBeenCalledWith(msg, params);
    });

    it("should work with 'error' method (Error object)", () => {
        spyOn(console, 'error');

        const err = new Error('This is an error.');
        const params = {
            properties: {
                key1: 'value1'
            }
        };

        logger.error(err, params);
        expect(console.error).toHaveBeenCalledWith(err, params);
    });

    it("should work with 'fatal' method (string message)", () => {
        spyOn(console, 'error');

        const msg = 'This is a fatal.';
        const params = {
            properties: {
                key1: 'value1'
            }
        };

        logger.fatal(msg, params);
        expect(console.error).toHaveBeenCalledWith(msg, params);
    });

    it("should work with 'fatal' method (Error object)", () => {
        spyOn(console, 'error');

        const err = new Error('This is a fatal.');
        const params = {
            properties: {
                key1: 'value1'
            }
        };

        logger.fatal(err, params);
        expect(console.error).toHaveBeenCalledWith(err, params);
    });

    it("should work with 'log' method", () => {
        const msg = 'This is a message.';
        const params = {
            properties: {
                key1: 'value1'
            }
        };

        spyOn(console, 'info');

        logger.log(LogLevel.Info, msg, params);
        expect(console.info).toHaveBeenCalledWith(msg, params);
    });

    it("should log nothing when 'LogLevel' is 'None' or unknown", () => {
        spyOn(console, 'trace');
        spyOn(console, 'debug');
        spyOn(console, 'info');
        spyOn(console, 'warn');
        spyOn(console, 'error');

        logger.log(LogLevel.None, 'This message does not log.', {});

        // tslint:disable: no-unsafe-any no-any
        expect((console.trace as any).calls.any()).toEqual(false);
        expect((console.debug as any).calls.any()).toEqual(false);
        expect((console.info as any).calls.any()).toEqual(false);
        expect((console.warn as any).calls.any()).toEqual(false);
        expect((console.error as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
    });

    it('should work with track page timing', () => {
        spyOn(console, 'log');

        // Coverage only - do nothing
        logger.startTrackPage();
        logger.stopTrackPage();

        // With properties
        logger.startTrackPage('home');
        logger.stopTrackPage('home', { uri: '/home' });

        // Without properties
        logger.startTrackPage('about');
        logger.stopTrackPage('about');

        expect(console.log).toHaveBeenCalled();
    });

    it('should not track page if page names are not the same', () => {
        spyOn(console, 'log');

        logger.startTrackPage('home1');
        logger.stopTrackPage('home2');

        // tslint:disable: no-unsafe-any no-any
        expect((console.log as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
    });

    it("should work with 'trackPageView'", () => {
        spyOn(console, 'log');

        // Coverage only - do nothing
        logger.trackPageView();

        logger.trackPageView({ name: 'home', uri: '/home' });
        logger.trackPageView({ name: 'about' });
        expect(console.log).toHaveBeenCalled();
    });

    it('should work with track event timing', () => {
        spyOn(console, 'log');

        // With properties
        logger.startTrackEvent('event1');
        logger.stopTrackEvent('event1', { eventCategory: 'test' });

        // Without properties
        logger.startTrackEvent('event2');
        logger.stopTrackEvent('event2');

        expect(console.log).toHaveBeenCalled();
    });

    it('should not track event if event names are not the same', () => {
        spyOn(console, 'log');

        logger.startTrackEvent('event1');
        logger.stopTrackEvent('event2');

        // tslint:disable: no-unsafe-any no-any
        expect((console.log as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
    });

    it("should work with 'trackEvent'", () => {
        spyOn(console, 'log');

        const eventData = {
            name: 'event1',
            eventCategory: 'test'
        };
        logger.trackEvent(eventData);
        logger.trackEvent({ name: 'event2' });

        // Coverage only, do nothing
        logger.flush();

        expect(console.log).toHaveBeenCalled();
    });
});
