/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { EventInfo, EventTimingInfo } from './event-info';
import { PageViewInfo, PageViewTimingInfo } from './page-view-info';

/**
 * The tracking interface.
 */
export interface TrackingApi {
    /**
     * Starts timing how long the user views a page. Call this when the page opens.
     * @param name A string that idenfities this item, unique within this HTML document. Default to document title.
     */
    startTrackPage(name?: string): void;

    /**
     * Logs how long a page was visible, after `startTrackPage`. Call this when the page closes.
     * @param name The string you used as the name in `startTrackPage`. Default to document title.
     * @param pageViewInfo Additional data for page view.
     */
    stopTrackPage(name?: string, pageViewInfo?: EventTimingInfo): void;

    /**
     * Logs that a page was viewed.
     * @param pageViewInfo Data for page view.
     */
    trackPageView(pageViewInfo: PageViewInfo): void;

    /**
     * Start timing an extended event. Call `stopTrackEvent` to log the event when it ends.
     * @param name A string that identifies this event uniquely within the document.
     */
    startTrackEvent(name: string): void;

    /**
     * Log an extended event that you started timing with `startTrackEvent`.
     * @param name The string you used to identify this event in `startTrackEvent`.
     * @param eventInfo Additional data for event.
     */
    stopTrackEvent(name: string, eventInfo?: PageViewTimingInfo): void;

    /**
     * Log a user action or other occurrence.
     * @param eventInfo Data for event.
     */
    trackEvent(eventInfo: EventInfo): void;
}
