import { TrackEventRequest } from './track-event-request';

/**
 * The track page view data.
 */
export interface TrackPageViewRequest extends TrackEventRequest {
    /**
     * The page's URL.
     */
    pageLocation?: string;
    /**
     * The path portion of location. This value must start with a slash (/) character.
     */
    pagePath?: string;
}
