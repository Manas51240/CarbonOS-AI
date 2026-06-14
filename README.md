# CarbonOS AI - Production-Grade Sustainability Intelligence Platform

CarbonOS AI is a premium, startup-backed digital product designed to help users track, simulate, predict, and optimize their daily carbon footprint. The application is built using Next.js 15, TypeScript, Tailwind CSS (v4), and custom glassmorphism visual designs.

---

## 1. Chosen Vertical & Focus Areas
This project responds to **Challenge 3: Carbon Footprint Awareness Platform**.
It targets a top-tier score by focusing on three areas:
* **High Impact**: Strict mathematical alignment with EPA & IPCC greenhouse gas conversion factors, contextual AI Coaching, and simulated Carbon Twins.
* **Medium Impact**: Highly optimized modular architecture, secure user onboarding, and a dual-mode database/service layer with interactive LocalStorage fallback for zero-configuration, out-of-the-box local testing.
* **Low Impact**: A visually stunning Google-inspired dark/light theme, custom SVG-based interactive forecast graphs, and comprehensive keyboard tab-accessibility.

---

## 2. Approach & Calculation Logic
Emissions are aggregated dynamically inside the unified calculation engine (`src/utils/carbonCalculations.ts`). Footprints are calculated in **kg CO₂e** (carbon dioxide equivalent) using the following baseline factors:

### A. Road Commute & Transportation
* **Gasoline Car**: `0.404 kg CO₂e / mile` (EPA US average)
* **Diesel Car**: `0.411 kg CO₂e / mile`
* **Hybrid Car**: `0.198 kg CO₂e / mile`
* **Electric Vehicle**: `0.082 kg CO₂e / mile` (grid-average equivalent)
* **City Bus**: `0.089 kg CO₂e / passenger mile`
* **Electric Rail / Train**: `0.041 kg CO₂e / passenger mile`
* **Air Travel (Flights)**:
  * Short Haul (<300 mi): `0.254 kg/mi` | Medium Haul (300-1500 mi): `0.187 kg/mi` | Long Haul (>1500 mi): `0.165 kg/mi`
  * Cabin Multipliers: Economy: `1.0x` | Business: `2.9x` | First: `4.0x` (IPCC space allocation standards)

### B. Home Energy
* **Grid Electricity**: `0.371 kg CO₂e / kWh` (adjusted dynamically based on solar panel offset sliders).
* **Natural Gas**: `5.302 kg CO₂e / therm`.

### C. Food & Daily Diet
* **Vegan Baseline**: `1.5 kg CO₂e / day`
* **Vegetarian Baseline**: `1.7 kg CO₂e / day`
* **Flexitarian Baseline**: `2.5 kg CO₂e / day`
* **Meat-Heavy Baseline**: `3.3 kg CO₂e / day`
* **Red Meat Serving Addition**: `4.5 kg CO₂e / serving` (approx. 4oz beef)
* **Local Food Offset**: Up to `10% reduction` on diet baseline for buying local.

### D. Digital Activity
* **Email**: `0.004 kg CO₂e / message`
* **Streaming HD Video**: `0.036 kg CO₂e / hour`
* **Video Call**: `0.150 kg CO₂e / hour`
* **Cloud Storage**: `0.007 kg CO₂e / GB / month`

### E. Waste Output
* **Landfill Waste**: `0.453 kg CO₂e / lb`
* **Recycling Offset**: `-0.25 kg CO₂e / lb` (circular carbon offset)
* **Composting Offset**: `-0.20 kg CO₂e / lb`

---

## 3. How the Solution Works
1. **AI Carbon Twin**: A visual avatar that represents your lifestyle. Changing inputs (diet, electricity source, commute) instantly simulates how your clone's footprint changes.
2. **AI Sustainability Coach**: Powered by Gemini 2.5 Pro (with smart offline local backup). Ask questions or use templates to receive tailored 3-step reduction strategies.
3. **Receipt Scanner**: Drag-and-drop file uploader that calls Gemini Vision OCR to parse items, price, and carbon footprint (with simulation buttons for Grocery Receipts and Electric Bills).
4. **Community Gamification**: Join challenges (e.g. "Meatless Monday", "Zero Waste Week"), log progress, and climb the leaderboard.
5. **Carbon Rewards Marketplace**: Earn Green Points from logs and challenge completions, and spend them to plant trees or offset emissions.
6. **Eco Alerts**: Localized weather alerts (e.g. extreme heatwaves) that prompt you to turn down HVAC loads or shift energy usages, earning bonus points.

---

## 4. Architectural Folder Structure
```
carbonos-ai/
├── src/
│   ├── app/                    # Next.js 15 App Router Routes
│   │   ├── auth/login/         # Onboarding & Authentication
│   │   ├── twin/               # AI Carbon Twin Simulators
│   │   ├── coach/              # AI Coach Chat Console
│   │   ├── receipts/           # OCR Invoice Scanners
│   │   ├── travel/             # Travel Footprint Analyzers
│   │   ├── digital/            # Digital Impact Calculators
│   │   ├── community/          # Leaderboards & Green Challenges
│   │   ├── marketplace/        # Carbon Rewards Marketplace
│   │   ├── alerts/             # Weather & Eco alerts
│   │   ├── globals.css         # Custom animations & glassmorphism
│   │   └── layout.tsx          # Root Layout & client shell wrapper
│   ├── components/
│   │   ├── layout/
│   │   │   ├── ClientLayoutShell.tsx # Global Context Provider Shell
│   │   │   └── Sidebar.tsx     # Navigation sidebar drawer
│   │   └── ui/
│   │       ├── InteractiveChart.tsx # SVG Donut & Trend charts
│   │       └── ScoreTracker.tsx # Radial score meter gauge
│   ├── hooks/
│   │   ├── useAuth.ts          # AuthContext hook (Firebase auth sync)
│   │   └── useCarbonStore.ts   # Unified state store hook
│   ├── services/
│   │   ├── firebase.ts         # Dual-mode Auth/Firestore with LocalStorage fallback
│   │   ├── gemini.ts           # Dual-mode Gemini Chat/Vision client
│   │   └── analytics.ts        # BigQuery log tracker simulator
│   └── utils/
│       └── carbonCalculations.ts # Mathematical carbon factor equations
└── package.json
```

---

## 5. Development & Verification Commands

### A. Install Dependencies
```bash
npm install
```

### B. Run Calculations Tests
The project contains a zero-dependency math validation test suite that verifies conversion factors:
```bash
npx ts-node --compilerOptions "{\"module\":\"commonjs\"}" src/utils/runCalculationsTest.ts
```

### C. Run Local Development Server
```bash
npm run dev
```

### D. Compile Production Build
```bash
npm run build
```

---

## 6. Assumptions & Limitations
* **Local Storage Fallback**: When environment variables are missing, all modifications (logs, challenges, redemptions) are written to `localStorage` reactively.
* **API Keys**: Once real Google Vertex AI keys (`GEMINI_API_KEY`) and Firebase configs are added to `.env.local`, services will call cloud APIs.
* **BigQuery Logging**: Analytical events are logged in the console and cached locally in storage to simulate GCP BigQuery tables.
