/**
 * The log telemetry info interface.
 */
export interface LogInfo {
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
    properties?: { [key: string]: unknown };
}
