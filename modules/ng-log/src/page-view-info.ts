/**
 * The track page view request data.
 */
export interface PageViewInfo {
    /**
     * The page's URL.
     */
    pageLocation?: string;
    /**
     * The path portion of location. This value must start with a slash (/) character.
     */
    pagePath?: string;
    /**
     * Metrics associated with this event.
     */
    measurements?: { [name: string]: number };
    /**
     * Mapping for custom dimensions and metrics.
     */
    customMap?: { [key: string]: string };
    /**
     * Measure event with specified tracker instrumentation key.
     */
    sendTo?: string;
}
