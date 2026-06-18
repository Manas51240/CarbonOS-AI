/**
 * CarbonOS AI - Complete Service Unit Test Suite
 * Asserts all business logic methods across refactored services.
 */

// Mock window and localStorage for Node.js E2E-style service testing
if (typeof global.window === 'undefined') {
  const mockStorage: Record<string, string> = {};
  (global as any).window = {};
  (global as any).localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => { mockStorage[key] = String(value); },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
  };
}

import { CarbonCalculationService } from '../services/CarbonCalculationService';
import { CarbonForecastService } from '../services/CarbonForecastService';
import { SustainabilityCoachService } from '../services/SustainabilityCoachService';
import { RewardsService } from '../services/RewardsService';
import { UserProfileService } from '../services/UserProfileService';
import { EmissionAnalyticsService } from '../services/EmissionAnalyticsService';
import { FootprintLog } from '../types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function executeTests() {
  console.log('=== STARTING CARBONOS SERVICE UNIT TESTS ===\n');

  try {
    // ----------------------------------------
    // 1. CarbonCalculationService Tests
    // ----------------------------------------
    console.log('--- Testing CarbonCalculationService ---');
    
    assert(
      Math.abs(CarbonCalculationService.calculateTransport({ type: 'car', distance: 10, fuelOrClass: 'gasoline' }) - 4.04) < 0.001,
      'Calculates car gasoline emissions correctly'
    );
    assert(
      Math.abs(CarbonCalculationService.calculateTransport({ type: 'car', distance: 10, fuelOrClass: 'electric' }) - 0.82) < 0.001,
      'Calculates EV car emissions correctly'
    );
    assert(
      Math.abs(CarbonCalculationService.calculateTransport({ type: 'flight', distance: 100, fuelOrClass: 'economy' }) - 25.4) < 0.001,
      'Calculates short-haul economy flight emissions correctly'
    );
    assert(
      Math.abs(CarbonCalculationService.calculateTransport({ type: 'flight', distance: 2000, fuelOrClass: 'business' }) - 957) < 0.001,
      'Calculates long-haul business flight emissions correctly'
    );
    assert(
      Math.abs(CarbonCalculationService.calculateTransport({ type: 'transit', distance: 10, fuelOrClass: 'train' }) - 0.41) < 0.001,
      'Calculates train transit emissions correctly'
    );
    assert(
      Math.abs(CarbonCalculationService.calculateEnergy({ electricityKwh: 10, gasTherms: 2, cleanEnergyPercentage: 0 }) - 14.314) < 0.001,
      'Calculates home energy emissions correctly'
    );
    assert(
      Math.abs(CarbonCalculationService.calculateFood({ dietType: 'vegan', servingsRedMeat: 0, localFoodPercentage: 0 }) - 1.5) < 0.001,
      'Calculates vegan diet emissions correctly'
    );
    assert(
      Math.abs(CarbonCalculationService.calculateDigital({ emailsSent: 10, streamingHours: 1, videoCallsHours: 1, cloudStorageGb: 10 }) - 0.228) < 0.01,
      'Calculates digital emissions correctly'
    );
    assert(
      Math.abs(CarbonCalculationService.calculateWaste({ landfillLbs: 5, recycledLbs: 2, compostedLbs: 1 }) - 1.565) < 0.001,
      'Calculates waste emissions correctly'
    );
    assert(
      CarbonCalculationService.calculateScore(8.5) === 100,
      'Sustainability score hits 100 maximum correctly'
    );
    assert(
      CarbonCalculationService.calculateScore(30) === 50,
      'Sustainability score calculates mid values correctly'
    );
    assert(
      CarbonCalculationService.calculateScore(60) === 0,
      'Sustainability score hits 0 boundary correctly'
    );

    // ----------------------------------------
    // 2. CarbonForecastService Tests
    // ----------------------------------------
    console.log('\n--- Testing CarbonForecastService ---');
    
    const savings = CarbonForecastService.projectSavings(20.0, 15.0);
    assert(savings.dailySaving === 5.0, 'Calculates daily saving projection');
    assert(savings.reductionPotentialPercentage === 25, 'Calculates reduction percentage');
    assert(Math.abs(savings.annualSaving - 1825.0) < 0.001, 'Calculates annual savings correctly');

    const dummyLogs: FootprintLog[] = [
      { id: '1', date: '2026-06-11', transport: 5, energy: 4, food: 2, digital: 0.1, waste: 0.5, total: 11.6 },
      { id: '2', date: '2026-06-12', transport: 6, energy: 3, food: 2, digital: 0.1, waste: 0.5, total: 11.6 },
      { id: '3', date: '2026-06-13', transport: 4, energy: 3, food: 2, digital: 0.1, waste: 0.5, total: 9.6 },
    ];
    const trend = CarbonForecastService.generateTrendData(dummyLogs);
    assert(trend.length === 6, 'Generates correct forecast and historical array size');
    assert(trend[trend.length - 1].projected !== null, 'Forecast elements contain projections');

    // ----------------------------------------
    // 3. UserProfileService Tests
    // ----------------------------------------
    console.log('\n--- Testing UserProfileService ---');
    
    const signupProfile = await UserProfileService.signUp('test-user@carbonos.ai', 'Tester');
    assert(signupProfile.displayName === 'Tester', 'Registers new user profiles');
    assert(signupProfile.greenPoints === 200, 'Awards sign up starter bonus');

    const loginProfile = await UserProfileService.signIn('test-user@carbonos.ai');
    assert(loginProfile.email === 'test-user@carbonos.ai', 'Logs in existing user profiles');

    const updatedProfile = await UserProfileService.updateCarbonTwin({
      diet: 'vegan',
      transportMode: 'electric',
      commuteDistance: 25,
      homeEnergy: '100-solar',
      digitalUsage: 'low'
    });
    assert(updatedProfile.carbonTwin.diet === 'vegan', 'Updates carbon twin config');
    assert(updatedProfile.carbonTwin.transportMode === 'electric', 'Persists twin changes');

    // ----------------------------------------
        // 4. SustainabilityCoachService Tests
    // ----------------------------------------
    console.log('\n--- Testing SustainabilityCoachService ---');
    
    const plan = SustainabilityCoachService.getPersonalizedPlan(updatedProfile);
    assert(plan.length === 3, 'Generates customized 3-step advice');
    assert(plan[0].reasonGenerated.includes('electric'), 'Tailors strategy to commute fuel type');

    const coachText = await SustainabilityCoachService.getCoachResponse([], 'Show my plan', updatedProfile);
    assert(coachText.includes('3-Step Carbon Reduction Plan'), 'Responds to query with active profile settings');

    // Mock user profiles to cover all branches in SustainabilityCoachService
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
    assert(plan1[0].strategy.includes('Swap 2 weekly commutes'), 'Transport commute gasoline/diesel plan');
    assert(plan1[1].strategy.includes('Reduce red meat'), 'Diet meat-heavy plan');
    assert(plan1[2].title.includes('Smart Thermostat'), 'Home energy grid-mix plan');

    const plan2 = SustainabilityCoachService.getPersonalizedPlan(flexitarianProfile);
    assert(plan2[0].strategy.includes('Swap 2 weekly commutes'), 'Transport commute short diesel plan');
    assert(plan2[1].strategy.includes('Meatless Monday'), 'Diet flexitarian plan');
    assert(plan2[2].title.includes('Digital Cleanse'), 'Home energy clean plan');

    const plan3 = SustainabilityCoachService.getPersonalizedPlan(cleanLowCommuteProfile);
    assert(plan3[0].strategy.includes('walking or cycling'), 'Active mobility low commute plan');
    assert(plan3[1].strategy.includes('locally grown'), 'Diet vegetarian/vegan organic plan');

    // Test different NLP query fallbacks
    const solarText = await SustainabilityCoachService.getCoachResponse([], 'What about solar panels?', updatedProfile);
    assert(solarText.includes('Installing solar panels'), 'Responds to solar query');

    const dietText = await SustainabilityCoachService.getCoachResponse([], 'What should I eat for my diet?', updatedProfile);
    assert(dietText.includes('agricultural greenhouse emissions'), 'Responds to diet query');

    const driveText = await SustainabilityCoachService.getCoachResponse([], 'Tell me about my drive', updatedProfile);
    assert(driveText.includes('reduces your transport footprint'), 'Responds to drive/car query');

    const defaultText = await SustainabilityCoachService.getCoachResponse([], 'Hello', updatedProfile);
    assert(defaultText.includes('As your Personalized Carbon Reduction Coach'), 'Responds to default query');

    // Test API route success path by mocking fetch and setting API key env var
    (global as any).__mockGeminiApi = true;
    const originalFetch = (global as any).fetch;
    (global as any).fetch = async (url: string) => {
      if (url === '/api/gemini/coach') {
        return {
          ok: true,
          json: async () => ({ reply: 'Gemini Coach Response' })
        } as any;
      }
      return { ok: false } as any;
    };

    const apiCoachText = await SustainabilityCoachService.getCoachResponse([], 'API test', updatedProfile);
    assert(apiCoachText === 'Gemini Coach Response', 'Fetches reply from Gemini API if key is present');

    // Test API route failure path fallback
    (global as any).fetch = async () => {
      throw new Error('API request failed');
    };
    const apiFailCoachText = await SustainabilityCoachService.getCoachResponse([], 'API fail test', updatedProfile);
    assert(apiFailCoachText.includes('As your Personalized Carbon Reduction Coach'), 'Falls back on API error');

    // Clean up mocks
    delete (global as any).__mockGeminiApi;
    if (originalFetch) {
      (global as any).fetch = originalFetch;
    } else {
      delete (global as any).fetch;
    }

    // ----------------------------------------
    // 5. RewardsService Tests
    // ----------------------------------------
    console.log('\n--- Testing RewardsService ---');
    
    const store = await RewardsService.getRewards();
    assert(store.length > 0, 'Retrieves rewards list');

    const redemptionFail = await RewardsService.redeemReward(store[0].id, 10);
    assert(redemptionFail.success === false, 'Blocks purchases with insufficient points balance');

    const redemptionSuccess = await RewardsService.redeemReward(store[0].id, 1000);
    assert(redemptionSuccess.success === true, 'Approves purchases with sufficient points balance');
    assert(redemptionSuccess.pointsDeducted === store[0].costPoints, 'Returns correct point deduction totals');

    // ----------------------------------------
    // 6. EmissionAnalyticsService Tests
    // ----------------------------------------
    console.log('\n--- Testing EmissionAnalyticsService ---');
    
    await EmissionAnalyticsService.logEvent(updatedProfile.uid, 'twin_simulation', { changed: 'diet' });
    const summary = await EmissionAnalyticsService.getSummary();
    assert(summary.twin_simulation === 1, 'Records analytical events successfully');

    console.log(`\n✅ UNIT TESTS COMPLETE: ${passedTests}/${totalTests} PASSED SUCCESSFULLY.`);
  } catch (err) {
    console.error('\n❌ UNIT TESTS FAILED.', err);
    process.exit(1);
  }
}

executeTests();
