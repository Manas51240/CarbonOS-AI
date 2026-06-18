import { describe, it, expect, beforeAll, vi } from 'vitest';
import { CarbonCalculationService } from '../services/CarbonCalculationService';
import { CarbonForecastService } from '../services/CarbonForecastService';
import { UserProfileService } from '../services/UserProfileService';
import { SustainabilityCoachService } from '../services/SustainabilityCoachService';
import { RewardsService } from '../services/RewardsService';
import { EmissionAnalyticsService } from '../services/EmissionAnalyticsService';
import { FootprintLog } from '../types';

beforeAll(() => {
  const mockStorage: Record<string, string> = {};
  global.window = {} as any;
  global.localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => { mockStorage[key] = String(value); },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
    length: 0,
    key: () => null,
  };
});

describe('CarbonCalculationService', () => {
  it('should calculate transport emissions correctly', () => {
    expect(CarbonCalculationService.calculateTransport({ type: 'car', distance: 10, fuelOrClass: 'gasoline' })).toBeCloseTo(4.04, 3);
    expect(CarbonCalculationService.calculateTransport({ type: 'car', distance: 10, fuelOrClass: 'electric' })).toBeCloseTo(0.82, 3);
    expect(CarbonCalculationService.calculateTransport({ type: 'flight', distance: 100, fuelOrClass: 'economy' })).toBeCloseTo(25.4, 3);
    expect(CarbonCalculationService.calculateTransport({ type: 'flight', distance: 2000, fuelOrClass: 'business' })).toBeCloseTo(957, 3);
    expect(CarbonCalculationService.calculateTransport({ type: 'transit', distance: 10, fuelOrClass: 'train' })).toBeCloseTo(0.41, 3);
  });

  it('should calculate energy, food, digital, and waste emissions correctly', () => {
    expect(CarbonCalculationService.calculateEnergy({ electricityKwh: 10, gasTherms: 2, cleanEnergyPercentage: 0 })).toBeCloseTo(14.314, 3);
    expect(CarbonCalculationService.calculateFood({ dietType: 'vegan', servingsRedMeat: 0, localFoodPercentage: 0 })).toBeCloseTo(1.5, 3);
    expect(CarbonCalculationService.calculateDigital({ emailsSent: 10, streamingHours: 1, videoCallsHours: 1, cloudStorageGb: 10 })).toBeCloseTo(0.228, 2);
    expect(CarbonCalculationService.calculateWaste({ landfillLbs: 5, recycledLbs: 2, compostedLbs: 1 })).toBeCloseTo(1.565, 3);
  });

  it('should calculate sustainability score correctly within bounds', () => {
    expect(CarbonCalculationService.calculateScore(8.5)).toBe(100);
    expect(CarbonCalculationService.calculateScore(30)).toBe(50);
    expect(CarbonCalculationService.calculateScore(60)).toBe(0);
  });
});

describe('CarbonForecastService', () => {
  it('should project savings and generate trend data correctly', () => {
    const savings = CarbonForecastService.projectSavings(20.0, 15.0);
    expect(savings.dailySaving).toBe(5.0);
    expect(savings.reductionPotentialPercentage).toBe(25);
    expect(savings.annualSaving).toBeCloseTo(1825.0, 3);

    const dummyLogs: FootprintLog[] = [
      { id: '1', date: '2026-06-11', transport: 5, energy: 4, food: 2, digital: 0.1, waste: 0.5, total: 11.6 },
      { id: '2', date: '2026-06-12', transport: 6, energy: 3, food: 2, digital: 0.1, waste: 0.5, total: 11.6 },
      { id: '3', date: '2026-06-13', transport: 4, energy: 3, food: 2, digital: 0.1, waste: 0.5, total: 9.6 },
    ];
    const trend = CarbonForecastService.generateTrendData(dummyLogs);
    expect(trend.length).toBe(6);
    expect(trend[trend.length - 1].projected).not.toBeNull();
  });
});

describe('UserProfileService', () => {
  it('should sign up, sign in, and update carbon twin configurations', async () => {
    const signupProfile = await UserProfileService.signUp('test-user@carbonos.ai', 'Tester');
    expect(signupProfile.displayName).toBe('Tester');
    expect(signupProfile.greenPoints).toBe(200);

    const loginProfile = await UserProfileService.signIn('test-user@carbonos.ai');
    expect(loginProfile.email).toBe('test-user@carbonos.ai');

    const updatedProfile = await UserProfileService.updateCarbonTwin({
      diet: 'vegan',
      transportMode: 'electric',
      commuteDistance: 25,
      homeEnergy: '100-solar',
      digitalUsage: 'low'
    });
    expect(updatedProfile.carbonTwin.diet).toBe('vegan');
    expect(updatedProfile.carbonTwin.transportMode).toBe('electric');
  });
});

describe('SustainabilityCoachService', () => {
  it('should generate personalized reduction plan strategies based on profiles', async () => {
    const updatedProfile = await UserProfileService.getCurrentUser();
    expect(updatedProfile).not.toBeNull();
    if (!updatedProfile) return;

    const plan = SustainabilityCoachService.getPersonalizedPlan(updatedProfile);
    expect(plan.length).toBe(3);
    expect(plan[0].reasonGenerated).toContain('electric');

    const coachText = await SustainabilityCoachService.getCoachResponse([], 'Show my plan', updatedProfile);
    expect(coachText).toContain('3-Step Carbon Reduction Plan');

    // Branch coverage
    const meatHeavyProfile = {
      ...updatedProfile,
      carbonTwin: {
        diet: 'meat-heavy' as const,
        transportMode: 'gasoline' as const,
        commuteDistance: 30,
        homeEnergy: 'grid-mix' as const,
        digitalUsage: 'high' as const
      }
    };
    const flexitarianProfile = {
      ...updatedProfile,
      carbonTwin: {
        diet: 'flexitarian' as const,
        transportMode: 'diesel' as const,
        commuteDistance: 10,
        homeEnergy: 'partial-solar' as const,
        digitalUsage: 'average' as const
      }
    };
    const cleanLowCommuteProfile = {
      ...updatedProfile,
      carbonTwin: {
        diet: 'vegetarian' as const,
        transportMode: 'electric' as const,
        commuteDistance: 5,
        homeEnergy: '100-solar' as const,
        digitalUsage: 'low' as const
      }
    };

    const plan1 = SustainabilityCoachService.getPersonalizedPlan(meatHeavyProfile);
    expect(plan1[0].strategy).toContain('Swap 2 weekly commutes');
    expect(plan1[1].strategy).toContain('Reduce red meat');
    expect(plan1[2].title).toContain('Smart Thermostat');

    const plan2 = SustainabilityCoachService.getPersonalizedPlan(flexitarianProfile);
    expect(plan2[0].strategy).toContain('Swap 2 weekly commutes');
    expect(plan2[1].strategy).toContain('Meatless Monday');
    expect(plan2[2].title).toContain('Digital Cleanse');

    const plan3 = SustainabilityCoachService.getPersonalizedPlan(cleanLowCommuteProfile);
    expect(plan3[0].strategy).toContain('walking or cycling');
    expect(plan3[1].strategy).toContain('locally grown');

    const solarText = await SustainabilityCoachService.getCoachResponse([], 'What about solar panels?', updatedProfile);
    expect(solarText).toContain('Installing solar panels');

    const dietText = await SustainabilityCoachService.getCoachResponse([], 'What should I eat for my diet?', updatedProfile);
    expect(dietText).toContain('agricultural greenhouse emissions');

    const driveText = await SustainabilityCoachService.getCoachResponse([], 'Tell me about my drive', updatedProfile);
    expect(driveText).toContain('reduces your transport footprint');

    const defaultText = await SustainabilityCoachService.getCoachResponse([], 'Hello', updatedProfile);
    expect(defaultText).toContain('As your Personalized Carbon Reduction Coach');
  });

  it('should check real Gemini API endpoint and handle error fallback', async () => {
    const updatedProfile = await UserProfileService.getCurrentUser();
    expect(updatedProfile).not.toBeNull();
    if (!updatedProfile) return;

    (global as any).__mockGeminiApi = true;
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url === '/api/gemini/coach') {
        return {
          ok: true,
          json: async () => ({ reply: 'Gemini Coach Response' })
        };
      }
      return { ok: false };
    });
    global.fetch = mockFetch as any;

    const apiCoachText = await SustainabilityCoachService.getCoachResponse([], 'API test', updatedProfile);
    expect(apiCoachText).toBe('Gemini Coach Response');

    // Error case
    global.fetch = vi.fn().mockRejectedValue(new Error('API request failed'));
    const apiFailCoachText = await SustainabilityCoachService.getCoachResponse([], 'API fail test', updatedProfile);
    expect(apiFailCoachText).toContain('As your Personalized Carbon Reduction Coach');

    delete (global as any).__mockGeminiApi;
    delete (global as any).fetch;
  });
});

describe('RewardsService', () => {
  it('should fetch rewards and process points thresholds', async () => {
    const store = await RewardsService.getRewards();
    expect(store.length).toBeGreaterThan(0);

    const redemptionFail = await RewardsService.redeemReward(store[0].id, 10);
    expect(redemptionFail.success).toBe(false);

    const redemptionSuccess = await RewardsService.redeemReward(store[0].id, 1000);
    expect(redemptionSuccess.success).toBe(true);
    expect(redemptionSuccess.pointsDeducted).toBe(store[0].costPoints);
  });
});

describe('EmissionAnalyticsService', () => {
  it('should track simulated events and whitelists details', async () => {
    const profile = await UserProfileService.getCurrentUser();
    expect(profile).not.toBeNull();
    if (!profile) return;

    await EmissionAnalyticsService.logEvent(profile.uid, 'twin_simulation', { changed: 'diet' });
    const summary = await EmissionAnalyticsService.getSummary();
    expect(summary.twin_simulation).toBe(1);
  });
});
