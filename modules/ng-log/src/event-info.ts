// tslint:disable: no-any

/**
 * The event timing telemetry interface.
 */
export interface EventTimingInfo {
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
    /**
     * The string that will appear as the event label.
     */
    eventLabel?: string;
    /**
     * The string that will appear as the event category.
     */
    eventCategory?: string;
}

/**
 * The event telemetry interface.
 */
export interface EventInfo extends EventTimingInfo {
    /**
     * The event action name.
     */
    name: string;
}
