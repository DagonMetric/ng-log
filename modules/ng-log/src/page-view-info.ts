/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The page view timing telemetry info interface.
 */
export interface PageViewTimingInfo {
    /**
     * Mapping for custom dimensions and metrics.
     */
    custom_map?: { [key: string]: string };
    /**
     * Metrics associated with this event.
     */
    measurements?: { [key: string]: number };
    /**
     * Additional properties.
     */
    properties?: { [key: string]: any };
    /**
     * The page's URL.
     */
    uri?: string;
    /**
     * The URL of the source page where current page is loaded from.
     */
    ref_uri?: string;
    /**
     * The page type.
     */
    page_type?: string;
    /**
     * Is user logged in.
     */
    is_logged_in?: boolean;
}

/**
 * The page view telemetry info interface.
 */
export interface PageViewInfo extends PageViewTimingInfo {
    /**
     * The page title. Default to document title.
     */
    name?: string;
}
