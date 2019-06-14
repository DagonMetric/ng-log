import { JsonValue } from './json-object';

/**
 * The track event data.
 */
export interface TrackEventRequest {
    /**
     * The string that will appear as the event category.
     */
    eventCategory?: string;
    /**
     * The string that will appear as the event label.
     */
    eventLabel?: string;
    /**
     * Metrics associated with this event.
     */
    measurements?: { [name: string]: number };
    /**
     * Measure event with specified tracker instrumentation key.
     */
    sendTo?: string;
    /**
     * Additional properties.
     */
    [name: string]: JsonValue | undefined;
}
