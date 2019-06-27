// tslint:disable: no-any

/**
 * The page view timing telemetry interface.
 */
export interface PageViewTimingInfo {
    /**
     * Mapping for custom dimensions and metrics.
     */
    customMap?: { [key: string]: string };
    /**
     * Metrics associated with this event.
     */
    measurements?: { [key: string]: number };
    /**
     * Additional properties.
     */
    properties?: { [key: string]: any; };
    /**
     * The page's URL.
     */
    uri?: string;
    /**
     * The URL of the source page where current page is loaded from.
     */
    refUri?: string;
    /**
     * The page type.
     */
    pageType?: string;
    /**
     * Is user logged in.
     */
    isLoggedIn?: boolean;
}

/**
 * The page view telemetry interface.
 */
export interface PageViewInfo extends PageViewTimingInfo {
    /**
     * The page title. Default to document title.
     */
    name?: string;
}
