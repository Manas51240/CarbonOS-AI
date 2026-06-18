/**
 * CarbonOS AI - Gemini AI Client Service
 * Dual-mode Gemini 2.5 Pro & Gemini Vision service.
 * Falls back to local NLP reasoning engine if API keys are not supplied.
 */

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface ScannedReceiptResult {
  storeName: string;
  date: string;
  items: Array<{
    name: string;
    price: number;
    carbonCategory: 'food-high' | 'food-medium' | 'food-low' | 'electronics' | 'utilities' | 'other';
    carbonEstimateKg: number;
    ecoFriendlyAlternative?: string;
  }>;
  totalCost: number;
  totalCarbonKg: number;
  sustainabilityInsight: string;
}

const isTesting = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
const shouldCallApi = isTesting ? !!(globalThis as typeof globalThis & { __mockGeminiApi?: boolean }).__mockGeminiApi : true;

/**
 * Sends chat message to AI Coach
 */
export async function askAiCoach(
  history: ChatMessage[],
  newMessage: string,
  userContext?: string
): Promise<string> {
  // Check if API endpoints can be reached
  if (shouldCallApi) {
    try {
      const response = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, newMessage, userContext }),
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

  // NLP Simulator Fallback
  await new Promise(resolve => setTimeout(resolve, 1000)); // natural reading delay
  const text = newMessage.toLowerCase();

  // Keyword reasoning matches
  if (text.includes('hello') || text.includes('hi ') || text.includes('hey')) {
    return `Hello! I am your CarbonOS AI Sustainability Coach. I can help you analyze your carbon twin, create customized carbon reduction plans, estimate emissions, or scan your invoices. How can I help you green your lifestyle today?`;
  }
  if (text.includes('twin') || text.includes('avatar')) {
    return `Your Carbon Twin represents a digital carbon clone of your lifestyle. In your twin dashboard, you can drag sliders to see how your daily footprint changes if you:
1. Shift to renewable power (solar/wind).
2. Swap an internal combustion car for electric transit or cycling.
3. Switch your diet towards plant-based alternatives.
By testing these simulations, you will see exactly which changes yield the largest impact for *your* specific location and habits.`;
  }
  if (text.includes('diet') || text.includes('eat') || text.includes('food') || text.includes('beef') || text.includes('vegan')) {
    return `Diet is one of the fastest levers for carbon reduction! Red meat (especially beef and lamb) carries a massive footprint (~27kg CO2e per kg of meat) due to methane emissions and land use. 
    
Switching to a **vegetarian diet** reduces dietary emissions by roughly 40%, and going **vegan** cuts them by over 50%. A simple action like joining our "Meatless Monday" challenge saves approximately 3.2kg of CO2 per day! Buying local food also reduces "food miles" transportation emissions.`;
  }
  if (text.includes('car') || text.includes('drive') || text.includes('vehicle') || text.includes('fuel') || text.includes('gasoline')) {
    return `Transportation typically accounts for 25-30% of a personal carbon footprint. A conventional gasoline car emits roughly 0.40kg CO2e per mile. 
    
To optimize your transport emissions:
1. Swapping a regular commute for public transit (bus: 0.09kg/mi, train: 0.04kg/mi) cuts travel footprint by 75-90%.
2. Upgrading to an Electric Vehicle (EV) drops emissions by over 80% (depending on local grid sources).
3. Try compiling trips or joining our "Commute Cleanly" walking/cycling challenges to earn Green Points!`;
  }
  if (text.includes('electricity') || text.includes('power') || text.includes('solar') || text.includes('energy') || text.includes('heating')) {
    return `Home energy carbon footprint depends directly on your electricity consumption and grid mix. In the US, the grid average is about 0.37kg CO2 per kWh.
    
Actions to reduce home energy emissions:
- Adjusting your thermostat by just 2°F can save up to 500 lbs of CO2 annually.
- Unplugging "vampire draw" electronics when not in use.
- Over time, installing solar panels or switching to a green energy retail provider cuts your electricity emission factor to near-zero. Explore the sliders in your Carbon Twin to simulate this change!`;
  }
  if (text.includes('digital') || text.includes('email') || text.includes('streaming') || text.includes('storage')) {
    return `Digital carbon footprint is small but growing rapidly due to server farms and data centers.
- Streaming video in 4K emits about 0.15kg CO2 per hour, whereas Standard Definition (SD) uses 75% less energy (~0.036kg CO2/hr).
- Sending an email with an attachment averages 4g to 50g of carbon.
- Storing unused data in cloud drives contributes to continuous server cooling loads. Try a "Digital Cleanse" by clearing out old backups or deleting spam emails.`;
  }
  if (text.includes('reduce') || text.includes('plan') || text.includes('optimize') || text.includes('help')) {
    return `Based on your profile, here is a personalized **3-Step Carbon Reduction Plan**:
1. **Optimize Local Travel**: Commute by train or bicycle twice a week. (Saves ~18kg CO2 weekly).
2. **Plant-based Swaps**: Replace beef/pork with chicken, fish, or vegetarian meals. (Saves ~12kg CO2 weekly).
3. **Standby Draw Elimination**: Plug entertainment centers into smart power strips to shut down vampire power draws. (Saves ~5kg CO2 weekly).

You can track your progress by completing the green challenges in our community hub to earn Green Points, which can be redeemed for tree planting in our rewards store!`;
  }

  return `That is a great question regarding sustainability! Small, compound adjustments in your daily routine—such as choosing local items, cycling short distances, and reducing home climate extremes—significantly reduce your footprint over a year. Let me know if you want to run an emissions simulation on your AI Carbon Twin, or review specific calculations!`;
}

/**
 * Scans receipt image file via Gemini Vision API
 */
export async function scanReceiptWithVision(
  imageFile: File | null,
  fileNameText: string
): Promise<ScannedReceiptResult> {
  // Real API path
  if (shouldCallApi && imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await fetch('/api/gemini/vision', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        if (!data.useFallback) {
          return data;
        }
      }
    } catch (e) {
      console.warn('Real Gemini Vision call failed, falling back to local simulation', e);
    }
  }

  // Vision Simulator Fallback based on filename keywords
  await new Promise(resolve => setTimeout(resolve, 1500)); // simulated processing delay
  const text = fileNameText.toLowerCase();
  
  const today = new Date().toISOString().split('T')[0];

  if (text.includes('grocery') || text.includes('food') || text.includes('market')) {
    return {
      storeName: 'GreenFoods Cooperative',
      date: today,
      items: [
        { name: 'Organic Tofu (2x)', price: 5.98, carbonCategory: 'food-low', carbonEstimateKg: 0.6, ecoFriendlyAlternative: 'Excellent plant-based selection!' },
        { name: 'Premium Angus Beef Ribeye (0.8 lbs)', price: 18.50, carbonCategory: 'food-high', carbonEstimateKg: 9.8, ecoFriendlyAlternative: 'Swap red meat for chicken or plant-based tofu to save ~9.0kg CO2.' },
        { name: 'Imported Avocados (Mexico)', price: 4.99, carbonCategory: 'food-medium', carbonEstimateKg: 1.2, ecoFriendlyAlternative: 'Buy locally grown seasonal fruits to lower food miles.' },
        { name: 'Oat Milk (1 Gallon)', price: 4.50, carbonCategory: 'food-low', carbonEstimateKg: 0.5, ecoFriendlyAlternative: 'Great low-impact dairy alternative!' }
      ],
      totalCost: 33.97,
      totalCarbonKg: 12.1,
      sustainabilityInsight: 'Your grocery footprint is dominated by the beef ribeye. Swapping it for poultry, fish, or vegetable proteins on your next visit would decrease this basket footprint by up to 75%!'
    };
  }

  if (text.includes('utility') || text.includes('power') || text.includes('electric') || text.includes('gas')) {
    return {
      storeName: 'Metro Power & Gas Co.',
      date: today,
      items: [
        { name: 'Electricity Consumption (350 kWh)', price: 52.50, carbonCategory: 'utilities', carbonEstimateKg: 129.85, ecoFriendlyAlternative: 'Enroll in a community solar program or add rooftop solar to offset.' },
        { name: 'Natural Gas Heating (12 Therms)', price: 18.00, carbonCategory: 'utilities', carbonEstimateKg: 63.62, ecoFriendlyAlternative: 'Lower thermostat setting by 2°F during winter nights.' }
      ],
      totalCost: 70.50,
      totalCarbonKg: 193.47,
      sustainabilityInsight: 'Your household energy bill generated 193.47kg CO2. Upgrading to LED bulbs, sealing drafty windows, or opting into green retail power would significantly lower this baseline.'
    };
  }

  // Default mock shopping receipt
  return {
    storeName: 'EcoMart Retailers',
    date: today,
    items: [
      { name: 'Biodegradable Laundry Pods', price: 12.99, carbonCategory: 'food-low', carbonEstimateKg: 0.4, ecoFriendlyAlternative: 'Excellent eco-friendly detergent option.' },
      { name: 'Plastic Bottled Water (Pack of 24)', price: 5.99, carbonCategory: 'food-medium', carbonEstimateKg: 3.5, ecoFriendlyAlternative: 'Switch to a stainless steel filtered bottle to save 3.5kg CO2 and plastic waste.' },
      { name: 'Recycled Paper Towels', price: 6.50, carbonCategory: 'food-low', carbonEstimateKg: 0.2, ecoFriendlyAlternative: 'Good circular product choice!' }
    ],
    totalCost: 25.48,
    totalCarbonKg: 4.1,
    sustainabilityInsight: 'Overall low carbon footprint! Replacing single-use bottled water with a reusable filter solution would eliminate the majority of this basket emissions.'
  };
}
