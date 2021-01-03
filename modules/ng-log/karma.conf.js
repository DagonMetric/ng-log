/* eslint-disable no-undef */

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('karma-junit-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            // leave Jasmine Spec Runner output visible in browser
            clearContext: false
        },
        coverageReporter: {
            dir: require('path').join(__dirname, '../../coverage/ng-log'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'lcovonly' }, { type: 'text-summary' }, { type: 'cobertura' }]
        },
        reporters: ['progress', 'kjhtml'],
        junitReporter: {
            outputDir: '../../junit/ng-log'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        customLaunchers: {
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        singleRun: false,
        restartOnFileChange: true
    });
};
