/**
 * The event timing telemetry info interface.
 */
export interface EventTimingInfo {
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

/**
 * The event telemetry info interface.
 */
export interface EventInfo extends EventTimingInfo {
    /**
     * The event action name.
     */
    name: string;
}
