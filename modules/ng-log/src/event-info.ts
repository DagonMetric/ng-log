// tslint:disable: no-any

/**
 * The track event data base.
 */
export interface EventInfoBase {
    /**
     * The string that will appear as the event label.
     */
    eventLabel?: string;
    /**
     * The string that will appear as the event category.
     */
    eventCategory?: string;
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

/**
 * The track event data.
 */
export interface EventInfo extends EventInfoBase {
    /**
     * Additional properties.
     */
    [name: string]: any;
}
