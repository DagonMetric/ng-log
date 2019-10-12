// tslint:disable: no-floating-promises
// tslint:disable: no-console

import { LogLevel } from '../../src/log-level';

import { ConsoleLogger } from '../src/console-logger';

describe('ConsoleLogger', () => {
    let logger: ConsoleLogger;

    beforeEach(() => {
        logger = new ConsoleLogger('test', { enableDebug: true });
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

        spyOn(console, 'trace');
        spyOn(console, 'debug');
        spyOn(console, 'info');
        spyOn(console, 'warn');
        spyOn(console, 'error');

        logger.log(LogLevel.Trace, msg);
        expect(console.trace).toHaveBeenCalledWith(msg);

        logger.log(LogLevel.Debug, msg);
        expect(console.debug).toHaveBeenCalledWith(msg);

        logger.log(LogLevel.Info, msg);
        expect(console.info).toHaveBeenCalledWith(msg);

        logger.log(LogLevel.Warn, msg);
        expect(console.warn).toHaveBeenCalledWith(msg);

        logger.log(LogLevel.Error, msg);
        expect(console.error).toHaveBeenCalledWith(msg);

        logger.log(LogLevel.Critical, msg);
        expect(console.error).toHaveBeenCalledWith(msg);
    });

    it("should not log anything when 'LogLevel' is 'None' or unknown", () => {
        spyOn(console, 'trace');
        spyOn(console, 'debug');
        spyOn(console, 'info');
        spyOn(console, 'warn');
        spyOn(console, 'error');

        logger.log(LogLevel.None, 'This message does not log.', {});
        logger.log(100, 'This message does not log.', {});

        // tslint:disable: no-unsafe-any no-any
        expect((console.trace as any).calls.any()).toEqual(false);
        expect((console.debug as any).calls.any()).toEqual(false);
        expect((console.info as any).calls.any()).toEqual(false);
        expect((console.warn as any).calls.any()).toEqual(false);
        expect((console.error as any).calls.any()).toEqual(false);
        // tslint:enable: no-unsafe-any no-any
    });

    it("should work with 'startTrackPage' and 'stopTrackPage'", () => {
        spyOn(console, 'log');

        // With properties
        logger.startTrackPage('home');
        logger.stopTrackPage('home', { uri: '/home' });
        expect(console.log).toHaveBeenCalled();

        // Without properties
        logger.startTrackPage('about');
        logger.stopTrackPage('about');
        expect(console.log).toHaveBeenCalled();
    });

    it("should work with 'trackPageView'", () => {
        spyOn(console, 'log');

        logger.trackPageView({ name: 'home', uri: '/home' });
        logger.trackPageView({ name: 'about' });
        expect(console.log).toHaveBeenCalled();
    });

    it("should log an error when 'startTrackPage' was called more than once for this event without calling stop", () => {
        logger.startTrackPage('home1');

        spyOn(console, 'error');
        logger.startTrackPage('home1');

        expect(console.error)
            .toHaveBeenCalledWith("The 'startTrackPage' was called more than once for this event without calling stop, name: home1.");
    });

    // it("should log an error when calling 'startTrackPage', 'stopTrackPage' or 'trackPageView' if name could not be detected", () => {
    //     spyOn(console, 'error');

    //     logger.startTrackPage();
    //     expect(console.error).toHaveBeenCalledWith('Could not detect document title, please provide name parameter.');

    //     logger.stopTrackPage();
    //     expect(console.error).toHaveBeenCalledWith('Could not detect document title, please provide name parameter.');

    //     logger.trackPageView();
    //     expect(console.error).toHaveBeenCalledWith('Could not detect document title, please provide name parameter.');
    // });

    it("should log an error when calling 'stopTrackPage' without a corresponding start", () => {
        spyOn(console, 'error');

        logger.startTrackPage('home1');
        logger.stopTrackPage('home2');
        expect(console.error).toHaveBeenCalledWith("The 'stopTrackPage' was called without a corresponding start, name: home2.");
    });

    it("should work with 'startTrackEvent' and 'stopTrackEvent'", () => {
        spyOn(console, 'log');

        // With properties
        logger.startTrackEvent('event1');
        const eventInfo = { properties: { prop1: 'value1' } };
        logger.stopTrackEvent('event1', eventInfo);
        expect(console.log).toHaveBeenCalled();

        // Without properties
        logger.startTrackEvent('event2');
        logger.stopTrackEvent('event2');
        expect(console.log).toHaveBeenCalled();
    });

    it("should work with 'trackEvent'", () => {
        spyOn(console, 'log');

        logger.trackEvent({
            name: 'event1'
        });
        logger.trackEvent({ name: 'event2' });
        expect(console.log).toHaveBeenCalled();

        // Coverage only, do nothing
        logger.flush();
    });

    it('should not log anything when enableDebug is false', () => {
        spyOn(console, 'log');

        logger.options.enableDebug = false;

        logger.startTrackPage('home');
        logger.stopTrackPage('home');
        logger.trackPageView({ name: 'home' });

        logger.startTrackEvent('event1');
        logger.stopTrackEvent('event1');
        logger.trackEvent({ name: 'event1' });

        logger.flush();

        // tslint:disable-next-line: no-any no-unsafe-any
        expect((console.log as any).calls.any()).toEqual(false);
    });

    it("should log an error when 'startTrackEvent' was called more than once for this event without calling stop", () => {
        logger.startTrackEvent('event1');

        spyOn(console, 'error');

        logger.startTrackEvent('event1');
        expect(console.error)
            .toHaveBeenCalledWith("The 'startTrackEvent' was called more than once for this event without calling stop, name: event1.");
    });

    it("should log an error when calling 'stopTrackEvent' without a corresponding start", () => {
        spyOn(console, 'error');

        logger.startTrackEvent('event1');
        logger.stopTrackEvent('event2');
        expect(console.error).toHaveBeenCalledWith("The 'stopTrackEvent' was called without a corresponding start, name: event2.");
    });
});
