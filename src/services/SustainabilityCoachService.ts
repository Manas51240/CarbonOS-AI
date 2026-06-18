import { UserProfile, ChatMessage } from '@/types';

export interface ActionPlanStep {
  title: string;
  strategy: string;
  offsetSavingKg: number;
  reasonGenerated: string;
}

/**
 * Helper utility to sanitize dynamic user inputs to protect against XSS injections.
 */
export function sanitizeInput(text: string): string {
  return text.replace(/[&<>"']/g, (m) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return map[m] || m;
  });
}


/**
 * Service representing the Personalized Carbon Reduction Coach.
 * Delivers context-rich sustainability strategies and handles Gemini API interactions.
 */
export class SustainabilityCoachService {
  /**
   * Generates a profile-customized 3-step Carbon Reduction Plan.
   */
  static getPersonalizedPlan(user: UserProfile): ActionPlanStep[] {
    const { diet, transportMode, commuteDistance, homeEnergy } = user.carbonTwin;
    const steps: ActionPlanStep[] = [];

    // Step 1: Transport Commute strategy
    if (commuteDistance > 20 || transportMode === 'gasoline' || transportMode === 'diesel') {
      const isClean = transportMode === 'electric' || transportMode === 'hybrid';
      steps.push({
        title: 'Optimize Local Commute',
        strategy: isClean 
          ? `Compile weekly trips or bicycle/walk for commutes under 5 miles instead of driving your ${transportMode} vehicle.`
          : `Swap 2 weekly commutes from your gasoline/diesel car to public electric transit (rail/train) or carpool.`,
        offsetSavingKg: isClean ? 2.5 : parseFloat((commuteDistance * 0.3 * 2).toFixed(1)),
        reasonGenerated: `Generated because your daily commute is set to ${commuteDistance} miles using a ${transportMode} vehicle.`
      });
    } else {
      steps.push({
        title: 'Active Mobility Challenges',
        strategy: 'Try walking or cycling for short errands under 2 miles to establish zero-carbon lifestyle goals.',
        offsetSavingKg: 1.2,
        reasonGenerated: 'Generated because your transport commute is relatively low and clean, leaving room for micro-mobility enhancements.'
      });
    }

    // Step 2: Diet-based strategy
    if (diet === 'meat-heavy' || diet === 'flexitarian') {
      steps.push({
        title: 'Adopt Plant-Based Swaps',
        strategy: diet === 'meat-heavy'
          ? 'Reduce red meat consumption by swapping beef/pork for chicken or legumes for 2 meals per week.'
          : 'Participate in our Meatless Monday community challenge, switching to a completely vegan day.',
        offsetSavingKg: diet === 'meat-heavy' ? 9.0 : 3.2,
        reasonGenerated: `Generated because your baseline diet profile is configured as ${diet}.`
      });
    } else {
      steps.push({
        title: 'Sustain local organic sourcing',
        strategy: 'Purchase locally grown seasonal fruits and vegetables to reduce global food-miles transport.',
        offsetSavingKg: 0.8,
        reasonGenerated: `Generated because you have already adopted a low-impact ${diet} diet.`
      });
    }

    // Step 3: Home Energy or Digital strategy
    if (homeEnergy === 'grid-mix') {
      steps.push({
        title: 'Install Smart Thermostat & Power Strips',
        strategy: 'Adjust thermostat baseline by 2°F and unplug standby vampire electronics when not in use.',
        offsetSavingKg: 4.8,
        reasonGenerated: `Generated because your electricity grid is powered by standard utility grid-mix.`
      });
    } else {
      steps.push({
        title: 'Perform Digital Cleanse',
        strategy: 'Unsubscribe from 20 unused newsletter channels and stream in standard definition instead of 4K.',
        offsetSavingKg: 1.5,
        reasonGenerated: `Generated because you already have clean solar energy sources, making digital server footprints your next micro-reduction target.`
      });
    }

    return steps;
  }

  /**
   * Contacts Gemini coach endpoint or falls back to local context-aware NLP logic.
   */
  static async getCoachResponse(
    history: ChatMessage[],
    newMessage: string,
    user: UserProfile
  ): Promise<string> {
    const sanitizedMsg = sanitizeInput(newMessage);
    const isTesting = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    const shouldCallApi = isTesting ? !!(globalThis as typeof globalThis & { __mockGeminiApi?: boolean }).__mockGeminiApi : true;
    const twinContext = `User's current profile: Diet is ${user.carbonTwin.diet}, vehicle type is ${user.carbonTwin.transportMode}, daily commute is ${user.carbonTwin.commuteDistance} miles, home energy is ${user.carbonTwin.homeEnergy}.`;

    if (shouldCallApi) {
      try {
        const response = await fetch('/api/gemini/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history, newMessage: sanitizedMsg, userContext: twinContext }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.reply) {
            return data.reply;
          }
        }
      } catch (e) {
        console.warn('Real Gemini API call failed, falling back to local coach simulation', e);
      }
    }

    // Context-Aware Local Reasoning fallback
    await new Promise(resolve => setTimeout(resolve, 800));
    const query = sanitizedMsg.toLowerCase();

    if (query.includes('plan') || query.includes('reduce') || query.includes('help')) {
      const plan = this.getPersonalizedPlan(user);
      let output = `Based on your AI Carbon Twin settings, here is your personalized **3-Step Carbon Reduction Plan**:\n\n`;
      plan.forEach((step, index) => {
        output += `${index + 1}. **${step.title}** (Saves ~${step.offsetSavingKg}kg CO₂e)\n`;
        output += `   *Action*: ${step.strategy}\n`;
        output += `   *Why*: ${step.reasonGenerated}\n\n`;
      });
      return output;
    }

    if (query.includes('solar') || query.includes('energy') || query.includes('electricity') || query.includes('power')) {
      return `Your home energy carbon footprint depends directly on your utility grid mix. Installing solar panels or switching to a 100% renewable plan can reduce home emissions to zero.`;
    }

    if (query.includes('diet') || query.includes('food') || query.includes('vegan')) {
      return `As a ${user.carbonTwin.diet} user, diet is an excellent target. Swapping beef (~27kg CO2e per kg) for legumes saves 95% of agricultural greenhouse emissions. Try joining our community 'Meatless Monday' target to earn Green Points!`;
    }

    if (query.includes('drive') || /\bcar\b/.test(query) || query.includes('commute')) {
      return `Your commute is ${user.carbonTwin.commuteDistance} miles using a ${user.carbonTwin.transportMode} car. Swapping commutes for public transit or carpooling twice a week reduces your transport footprint by roughly 30%.`;
    }

    return `Hello! As your Personalized Carbon Reduction Coach, I recommend focusing on your largest emissions category: ${
      user.carbonTwin.commuteDistance > 20 ? 'Transportation' : 'Diet/Food'
    }. Let me know if you would like me to generate a 3-Step Reduction Plan or details on your carbon twin!`;
  }
}
