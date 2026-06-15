# System Architecture - CarbonOS AI

This document details the clean, feature-based architecture implemented in CarbonOS AI to enforce strict separation of concerns, DRY compliance, and testability.

## 1. Directory Structure

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

## 2. Architecture Patterns & Services

* **Services Layer**: Encapsulates pure business logic. Services are stateless and easily testable under standard Node.js mock runners.
* **Custom Hooks**: Bridge components and services. Hooks manage stateful side-effects (e.g. syncing local state reactively on profile score recalculation).
* **Presentational Components**: Retain visual rendering logic only. They contain zero calculation formulas, database transactions, or direct fetch calls.
