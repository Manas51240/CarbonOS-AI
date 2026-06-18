/**
 * CarbonOS AI - BigQuery Analytics Layer
 * Logs user events, carbon fluctuations, and simulation scenarios.
 * Connects to Google Cloud BigQuery API in production, otherwise log-prints and stores locally.
 */

import { AnalyticsDetailsSchemaMap } from '@/validators';

export interface AnalyticsEvent {
  eventId: string;
  timestamp: string;
  uid: string;
  eventType: 'footprint_logged' | 'twin_simulation' | 'challenge_completed' | 'reward_redeemed' | 'coach_query';
  details: Record<string, any>;
}

export const AnalyticsService = {
  /**
   * Logs an analytical event
   */
  async logEvent(
    uid: string,
    eventType: AnalyticsEvent['eventType'],
    details: Record<string, any>
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
        // Return only the keys that validated or fallback to empty object if validation fails
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

    // Console logging for developer visibility
    console.log(`[BigQuery Analytics] Event Tracked: ${eventType}`, event);

    // Save to event history buffer in localStorage for local dashboard graphs
    if (typeof window !== 'undefined') {
      try {
        const history = JSON.parse(localStorage.getItem('carbonos_analytics_events') || '[]');
        history.push(event);
        // Cap history at 100 events to manage storage size
        if (history.length > 100) history.shift();
        localStorage.setItem('carbonos_analytics_events', JSON.stringify(history));
      } catch (e) {
        console.error('Failed to log event to local analytics buffer', e);
      }
    }

    // Server-side integration path (BigQuery streaming insertion endpoint)
    if (process.env.BIGQUERY_DATASET_ID) {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
      } catch {
        // Fail silently in production fallbacks
      }
    }
  },

  /**
   * Retrieves aggregated event frequencies for local reports
   */
  async getLocalAnalyticsSummary(): Promise<Record<string, number>> {
    if (typeof window === 'undefined') return {};
    const history: AnalyticsEvent[] = JSON.parse(localStorage.getItem('carbonos_analytics_events') || '[]');
    
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
};
