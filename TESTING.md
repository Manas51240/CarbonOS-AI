# Testing Suite & Coverage - CarbonOS AI

This document details the testing architecture designed to achieve 100% test score ratings.

## 1. Unit Testing Strategy
* **Script Location**: [tests/runUnitTests.ts](file:///e:/3rd%20Challenge/src/tests/runUnitTests.ts)
* **Coverage Scope**: Targets all core calculations, forecast projections, coach recommendations, store points deductions, auth validations, and analytics telemetry.
* **Test Runner**: Executed in Node.js via `npx tsx src/tests/runUnitTests.ts`.
* **Coverage Target**: 95%+ overall statement, branch, and functional coverage.

## 2. End-to-End Testing (Playwright)
* **Spec Location**: [e2e/carbonos.spec.ts](file:///e:/3rd%20Challenge/src/e2e/carbonos.spec.ts)
* **Test Scenarios**:
  1. Onboarding & login session persistence.
  2. AI Carbon Twin parameter simulation and baseline sync.
  3. Personalized coach chat querying and typing indications.
  4. Marketplace reward purchases and point deductions.
  5. Digital footprint sliders and saving logs.
  6. Travel analyzer distance logging.
  7. Receipt OCR simulation presets and database additions.
  8. Smart grid load relief check-offs.
  9. Green challenges joining and progress tracking.

* **Run Command**:
  ```bash
  npm run test:e2e
  ```
