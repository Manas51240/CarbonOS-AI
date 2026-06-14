/**
 * CarbonOS AI - Calculations Test Suite & Runner
 * Validates carbon formula conversions against EPA/IPCC standards.
 */

import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateFoodEmissions,
  calculateDigitalEmissions,
  calculateWasteEmissions,
  calculateSustainabilityScore,
} from './carbonCalculations';

function assertEqual(actual: number, expected: number, tolerance = 0.01, testName: string) {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    console.log(`[PASS] ${testName} (Expected: ${expected.toFixed(3)}, Actual: ${actual.toFixed(3)})`);
  } else {
    console.error(`[FAIL] ${testName} (Expected: ${expected.toFixed(3)}, Actual: ${actual.toFixed(3)})`);
    throw new Error(`Assertion failed for: ${testName}`);
  }
}

export function runTests() {
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

    console.log('\n✅ ALL TEST ASSERTIONS COMPLETED SUCCESSFULLY.');
  } catch (err) {
    console.error('\n❌ TEST RUN ENCOUNTERED A FAILURE AS DETAILED ABOVE.');
    process.exit(1);
  }
}

// Execute if run directly via node
if (require.main === module) {
  runTests();
}
