import { AnalyticsEvent } from './analytics';
import { AnalyticsDetailsSchemaMap } from '@/validators';

const ANALYTICS_KEY = 'carbonos_analytics_events';

/**
 * Service managing telemetry logs, carbon simulator analytics, and BigQuery relays.
 */
export class EmissionAnalyticsService {
  /**
   * Tracks and stores an analytical carbon event.
   */
  static async logEvent(
    uid: string,
    eventType: AnalyticsEvent['eventType'],
    details: Record<string, unknown>
  ): Promise<void> {
    // Validate details with strict Zod whitelisting
    let validatedDetails = details;
    const schema = AnalyticsDetailsSchemaMap[eventType];
    if (schema) {
      const parsed = schema.safeParse(details);
      if (parsed.success) {
        validatedDetails = parsed.data;
      } else {
        console.warn(`[BigQuery Analytics] Schema validation failed for event '${eventType}':`, parsed.error.format());
        validatedDetails = {};
      }
    } else {
      validatedDetails = {};
    }

    const event: AnalyticsEvent = {
      eventId: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      uid,
      eventType,
      details: validatedDetails
    };

    console.log(`[BigQuery Analytics] Event Tracked: ${eventType}`, event);

    if (typeof window !== 'undefined') {
      try {
        const history = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
        history.push(event);
        if (history.length > 100) history.shift();
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(history));
      } catch (e) {
        console.error('Failed to log event to local analytics buffer', e);
      }
    }

    if (process.env.BIGQUERY_DATASET_ID) {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
      } catch {
        // Fail silently in production integrations
      }
    }
  }

  /**
   * Retrieves aggregated event summary.
   */
  static async getSummary(): Promise<Record<string, number>> {
    if (typeof window === 'undefined') return {};
    const history: AnalyticsEvent[] = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
    
    const summary: Record<string, number> = {
      footprint_logged: 0,
      twin_simulation: 0,
      challenge_completed: 0,
      reward_redeemed: 0,
      coach_query: 0
    };

    history.forEach(evt => {
      if (evt.eventType in summary) {
        summary[evt.eventType]++;
      }
    });

    return summary;
  }
}
