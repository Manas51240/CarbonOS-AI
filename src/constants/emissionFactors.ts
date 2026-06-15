/**
 * CarbonOS AI - Emission Factor Constants
 * Aligned with EPA & IPCC Guidelines (in kg CO2e)
 */
export const EMISSION_FACTORS = {
  car: {
    gasoline: 0.404,
    diesel: 0.411,
    hybrid: 0.198,
    electric: 0.082,
  },
  flight: {
    shortHaul: 0.254,
    mediumHaul: 0.187,
    longHaul: 0.165,
    multipliers: {
      economy: 1.0,
      business: 2.9,
      first: 4.0,
    },
  },
  transit: {
    bus: 0.089,
    train: 0.041,
  },
  energy: {
    electricityKwh: 0.371,
    gasTherm: 5.302,
  },
  food: {
    vegan: 1.5,
    vegetarian: 1.7,
    flexitarian: 2.5,
    'meat-heavy': 3.3,
    redMeatServing: 4.5,
  },
  digital: {
    email: 0.004,
    streamingHour: 0.036,
    videoCallHour: 0.150,
    cloudStorageGbMonth: 0.007,
  },
  waste: {
    landfill: 0.453,
    recycledOffset: -0.25,
    compostedOffset: -0.20,
  },
};
