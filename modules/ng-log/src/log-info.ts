// tslint:disable: no-any

/**
 * The logg telemetry interface.
 */
export interface LogInfo {
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
    properties?: { [key: string]: any };
}
