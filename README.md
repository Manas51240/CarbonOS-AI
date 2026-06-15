# CarbonOS AI - Sustainable Intelligence Platform

CarbonOS AI is a production-grade, AI-powered carbon footprint optimizer designed to help users track, simulate, forecast, and reduce their lifestyle greenhouse gas emissions.

💻 **Live Deployed App**: [https://carbonos-ai-160715832584.us-central1.run.app/](https://carbonos-ai-160715832584.us-central1.run.app/)  
📁 **Public Codebase**: [Manas51240/CarbonOS-AI](https://github.com/Manas51240/CarbonOS-AI)

---

## 1. Problem Statement & Mission
Global warming and climate change are driven by rising greenhouse gas emissions. While collective action is crucial, individual lifestyle choices (commutes, diet, household heating, digital consumption) represent a significant share of global emissions. However, static carbon calculators fail to provide actionable context-based advice.

**CarbonOS AI** solves this by establishing a dynamic, game-centered, and AI-driven sustainability console. By maintaining a **Digital Carbon Twin** representing the user's active choices, and syncing it with a context-aware **Personalized Carbon Reduction Coach** and a **Vision-enabled Receipt Scanner**, CarbonOS AI turns footprint tracking into an intuitive, compound game of daily carbon reduction.

---

## 2. Carbon Reduction Workflow (Understand, Track, Reduce, Improve)

Throughout the user journey, the platform guides individuals through the four core pillars of sustainability:
1. **UNDERSTAND**: See what activities (transport, diet, energy) contribute to your carbon twin's emissions, with explicit reasons for each recommendation.
2. **TRACK**: Keep log entries in real-time. The dashboard computes daily, weekly, and monthly projected footprints.
3. **REDUCE**: Take action on a personalized 3-step action plan with estimated CO₂ offsets (e.g. swapping gasoline commutes for train transits).
4. **IMPROVE**: Join community goals, earn Green Points, and redeem points in the store to plant trees.

---

## 3. Strict Feature-Based Folder Structure

```
src/
├── app/                  # Route page entry points (presentation only, < 200 lines)
├── components/           # UI Components (presentational only, < 150 lines)
│   ├── dashboard/        # Dashboard stats, plans, and forms
│   ├── carbon-twin/      # Carbon twin and avatar visualizers
│   ├── coach/            # Chat bubbles and advice panes
│   ├── marketplace/      # Rewards display cards
│   ├── alerts/           # Alert checklists
│   └── shared/           # Reusable layouts, headers, and UI primitives
├── hooks/                # Business logic wrappers
│   ├── useAuth.tsx       # Auth session hook
│   ├── useCarbonScore.ts # Score index hook
│   ├── useEmissionTracking.ts # Log tracker hook
│   ├── useForecast.ts    # Reduction forecasting hook
│   ├── useRewards.ts     # Store redemption hook
│   ├── useCarbonTwin.ts  # Simulation twin hook
│   └── useSustainabilityInsights.ts # Alert & advice hook
├── services/             # Core business service classes
│   ├── CarbonCalculationService.ts  # IPCC/EPA calculations
│   ├── CarbonForecastService.ts     # Future savings forecasts
│   ├── SustainabilityCoachService.ts # Custom 3-step action plans
│   ├── RewardsService.ts            # Point transaction checks
│   ├── UserProfileService.ts        # Auth session validation
│   └── EmissionAnalyticsService.ts  # Telemetry log logging
├── types/                # TypeScript interface declarations
│   └── index.ts
├── validators/           # Zod schema definitions
│   └── index.ts
└── tests/                # Unit tests achieving 95%+ coverage
```

---

## 4. Security & Boundary Features
To ensure enterprise-grade safety, CarbonOS AI integrates multiple layers of protection:
* **HTTP Security Headers**: Configured in `next.config.mjs` for Content-Security-Policy (CSP), HSTS enforcement, Clickjacking blocks, and MIME-sniffing protection.
* **Input Validation (Zod)**: All input boundaries (login email formats, twin parameter boundaries, reward point checks) are strictly validated at runtime.
* **Sanitization**: Protects against cross-site scripting (XSS) and injection attacks on chat boxes.

---

## 5. Comprehensive Testing Suite
CarbonOS AI implements two layers of testing validation, verifying both calculations and E2E state flows:

* **Mathematical Unit & State Tests**: Targets all calculations, forecasts, coach enforcements, and reward redemptions. (30/30 PASS).
  Run tests:
  ```bash
  npx tsx src/tests/runUnitTests.ts
  ```
* **Playwright E2E Tests**: Tests full user onboarding, avatar parameter settings, coach dialogues, marketplace checkouts, digital logs, travel entries, receipt scanning, and alerts.
  Run tests:
  ```bash
  npm run test:e2e
  ```

---

## 6. Accessibility Compliance (a11y)
* **Programmatic Label Associations**: Form controls and slider controls explicitly associate labels with inputs using `htmlFor` and `id`.
* **ARIA Landmarks**: Landmarks, `aria-label`, and screen-reader focus indications are integrated into inputs.
* **Reduced Motion**: Adaptive queries immediately freeze ambient glows and transition movements on request.
