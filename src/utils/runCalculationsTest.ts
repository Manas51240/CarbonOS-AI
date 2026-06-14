/**
 * CarbonOS AI - Calculations & State Transition Test Suite
 * Validates carbon formula conversions and simulated database state transitions.
 */

// Mock global localStorage for Node.js E2E-style service testing
if (typeof global.window === 'undefined') {
  const mockStorage: Record<string, string> = {};
  (global as any).window = {};
  (global as any).localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => { mockStorage[key] = String(value); },
    removeItem: (key: string) => { delete mockStorage[key]; }
  };
}

import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateFoodEmissions,
  calculateDigitalEmissions,
  calculateWasteEmissions,
  calculateSustainabilityScore,
} from './carbonCalculations';

import { FirebaseService } from '../services/firebase';

function assertEqual(actual: any, expected: any, tolerance = 0.01, testName: string) {
  if (typeof actual === 'number' && typeof expected === 'number') {
    const diff = Math.abs(actual - expected);
    if (diff <= tolerance) {
      console.log(`[PASS] ${testName} (Expected: ${expected.toFixed(3)}, Actual: ${actual.toFixed(3)})`);
    } else {
      console.error(`[FAIL] ${testName} (Expected: ${expected.toFixed(3)}, Actual: ${actual.toFixed(3)})`);
      throw new Error(`Assertion failed for: ${testName}`);
    }
  } else {
    if (actual === expected) {
      console.log(`[PASS] ${testName} (Expected: ${expected}, Actual: ${actual})`);
    } else {
      console.error(`[FAIL] ${testName} (Expected: ${expected}, Actual: ${actual})`);
      throw new Error(`Assertion failed for: ${testName}`);
    }
  }
}

export async function runTests() {
  console.log('=== STARTING CARBONOS FORMULA TESTS ===\n');

  try {
    // 1. Transport Emissions
    assertEqual(
      calculateTransportEmissions({ type: 'car', distance: 50, fuelOrClass: 'gasoline' }),
      50 * 0.404,
      0.001,
      'Car transport gasoline emissions calculation'
    );
    assertEqual(
      calculateTransportEmissions({ type: 'car', distance: 50, fuelOrClass: 'electric' }),
      50 * 0.082,
      0.001,
      'Car transport electric emissions calculation'
    );
    assertEqual(
      calculateTransportEmissions({ type: 'flight', distance: 200, fuelOrClass: 'economy' }),
      200 * 0.254 * 1.0,
      0.001,
      'Flight short-haul economy emissions calculation'
    );
    assertEqual(
      calculateTransportEmissions({ type: 'flight', distance: 2000, fuelOrClass: 'business' }),
      2000 * 0.165 * 2.9,
      0.001,
      'Flight long-haul business emissions calculation'
    );
    assertEqual(
      calculateTransportEmissions({ type: 'transit', distance: 30, fuelOrClass: 'train' }),
      30 * 0.041,
      0.001,
      'Public transit train emissions calculation'
    );

    // 2. Home Energy Emissions
    assertEqual(
      calculateEnergyEmissions({ electricityKwh: 100, gasTherms: 0, cleanEnergyPercentage: 0 }),
      100 * 0.371,
      0.001,
      'Electricity standard grid emissions calculation'
    );
    assertEqual(
      calculateEnergyEmissions({ electricityKwh: 100, gasTherms: 5, cleanEnergyPercentage: 50 }),
      (100 * 0.371 * 0.5) + (5 * 5.302),
      0.001,
      'Electricity partial solar + natural gas calculation'
    );

    // 3. Food/Diet Emissions
    assertEqual(
      calculateFoodEmissions({ dietType: 'vegan', servingsRedMeat: 0, localFoodPercentage: 0 }),
      1.5,
      0.001,
      'Vegan diet base emissions calculation'
    );
    assertEqual(
      calculateFoodEmissions({ dietType: 'meat-heavy', servingsRedMeat: 2, localFoodPercentage: 100 }),
      (3.3 * 0.90) + (2 * 4.5),
      0.001,
      'Meat-heavy diet + red meat servings + local food offset calculation'
    );

    // 4. Digital Footprint Emissions
    assertEqual(
      calculateDigitalEmissions({ emailsSent: 10, streamingHours: 2, videoCallsHours: 1, cloudStorageGb: 100 }),
      (10 * 0.004) + (2 * 0.036) + (1 * 0.150) + (100 * 0.007 * (1 / 30)),
      0.01,
      'Digital email + streaming + calls + cloud storage calculation'
    );

    // 5. Waste Output Emissions
    assertEqual(
      calculateWasteEmissions({ landfillLbs: 10, recycledLbs: 4, compostedLbs: 5 }),
      (10 * 0.453) + (4 * -0.25) + (5 * -0.20),
      0.001,
      'Waste landfill + offsets for recycling & composting calculation'
    );

    // 6. Sustainability Score Rating
    assertEqual(
      calculateSustainabilityScore(10),
      100,
      0.001,
      'Sustainability score 100 limit'
    );
    assertEqual(
      calculateSustainabilityScore(30),
      50,
      0.001,
      'Sustainability score middle range calculation'
    );
    assertEqual(
      calculateSustainabilityScore(55),
      0,
      0.001,
      'Sustainability score 0 limit'
    );

    console.log('\n=== STARTING STATE TRANSITION TESTS ===\n');

    // 7. Auth SignUp Flow Test
    const userProfile = await FirebaseService.auth.signUp('test@carbonos.ai', 'Test User');
    assertEqual(userProfile.email, 'test@carbonos.ai', 0, 'Auth SignUp Profile Email matches');
    assertEqual(userProfile.displayName, 'Test User', 0, 'Auth SignUp Profile Name matches');
    assertEqual(userProfile.greenPoints, 200, 0, 'Auth SignUp Starting Points matching');

    // 8. Carbon Log addition & Score Recalculation Test
    await FirebaseService.db.addFootprintLog({
      date: '2026-06-14',
      transport: 2.5,
      energy: 3.1,
      food: 1.5,
      digital: 0.1,
      waste: 0.5,
      total: 7.7
    });

    const activeProfile = await FirebaseService.auth.getCurrentUser();
    assertEqual(
      activeProfile?.sustainabilityScore,
      100,
      0,
      'Adding low-carbon footprint log yields optimal sustainability rating (100)'
    );

    // 9. Challenge Joining & Progress Completion Test
    const challenges = await FirebaseService.db.getChallenges();
    const targetChallenge = challenges[0];
    assertEqual(targetChallenge.joined, false, 0, 'Challenge initial state: unjoined');

    const joinedList = await FirebaseService.db.joinChallenge(targetChallenge.id);
    assertEqual(joinedList[0].joined, true, 0, 'Challenge state after joining: joined');

    const progressResult = await FirebaseService.db.updateChallengeProgress(targetChallenge.id, 100);
    assertEqual(progressResult.completed, true, 0, 'Challenge status after hitting 100% progress: complete');
    
    const postChallengeProfile = await FirebaseService.auth.getCurrentUser();
    assertEqual(
      postChallengeProfile?.greenPoints,
      200 + targetChallenge.pointsReward + 15, // sign up + challenge + 1 log (15pts)
      0,
      'Completing challenge distributes points reward successfully'
    );

    // 10. Reward Store Credit Validation & Redemptions
    const rewards = await FirebaseService.db.getRewards();
    const costlyReward = rewards.find(r => r.costPoints > 400); // e.g. Amazon donation
    
    if (costlyReward) {
      // Temporarily set user points low to assert credit blocking
      const currentProfile = await FirebaseService.auth.getCurrentUser();
      if (currentProfile) {
        currentProfile.greenPoints = 50; // insufficient
        localStorage.setItem('carbonos_user_profile', JSON.stringify(currentProfile));
      }

      const failRes = await FirebaseService.db.redeemReward(costlyReward.id);
      assertEqual(failRes.success, false, 0, 'Purchase is blocked if points balance is below cost');

      // Set user points high to assert success
      const updatedProfile = await FirebaseService.auth.getCurrentUser();
      if (updatedProfile) {
        updatedProfile.greenPoints = 1200; // sufficient
        localStorage.setItem('carbonos_user_profile', JSON.stringify(updatedProfile));
      }

      const successRes = await FirebaseService.db.redeemReward(costlyReward.id);
      assertEqual(successRes.success, true, 0, 'Purchase is approved if points balance exceeds cost');
      assertEqual(
        successRes.profile?.greenPoints,
        1200 - costlyReward.costPoints,
        0,
        'Points are deducted correctly after successful redemption'
      );
    }

    console.log('\n✅ ALL TEST ASSERTIONS COMPLETED SUCCESSFULLY.');
  } catch (err) {
    console.error('\n❌ TEST RUN ENCOUNTERED A FAILURE AS DETAILED ABOVE.', err);
    process.exit(1);
  }
}

// Execute if run directly via node
if (require.main === module) {
  runTests();
}
