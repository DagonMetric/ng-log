// tslint:disable: no-any

/**
 * The page view telemetry info interface.
 */
export interface PageViewInfo {
    /**
     * Mapping for custom dimensions and metrics.
     */
    customMap?: { [key: string]: string };
    /**
     * Metrics associated with this event.
     */
    measurements?: { [name: string]: number };
    /**
     * Additional properties.
     */
    properties?: {

        [key: string]: any;
    };
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
