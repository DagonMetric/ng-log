/**
 * The track page view data.
 */
export interface TrackPageViewRequest {
    /**
     * The page's URL.
     */
    pageLocation?: string;
    /**
     * The path portion of location. This value must start with a slash (/) character.
     */
    pagePath?: string;
    /**
     * Metrics associated with the page.
     */
    measurements?: { [name: string]: number };
    /**
     * Measure pageview with specified tracker instrumentation key.
     */
    sendTo?: string;
}
