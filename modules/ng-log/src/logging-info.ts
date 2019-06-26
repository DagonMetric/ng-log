// tslint:disable: no-any
/**
 * The logging telemetry info interface.
 */
export interface LoggingInfo {
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
}
