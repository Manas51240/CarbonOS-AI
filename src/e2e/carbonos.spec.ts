import { test, expect } from '@playwright/test';

test.describe('CarbonOS AI - End-to-End User Journeys', () => {
  
  test.beforeEach(async ({ context }) => {
    // Clear session cookies before each test to ensure no auth state bleed
    await context.clearCookies();
  });

  test('1. Onboarding & Login Flow', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForURL('**/auth/login');
    
    // Check brand header is visible
    await expect(page.locator('h1').first()).toContainText('CarbonOS');
    
    // Fill credentials in sandbox mode
    await page.fill('#email-input', 'e2e-tester@carbonos.ai');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Assert redirect to console dashboard
    await page.waitForURL('**/');
    await expect(page.locator('h1').last()).toContainText('Console Dashboard');
    await expect(page.locator('body')).toContainText('E2e-tester');
  });

  test('2. AI Carbon Twin Simulation & Baseline Commits', async ({ page }) => {
    // Navigate straight to twin page
    await page.goto('/auth/login');
    await page.fill('#email-input', 'twin-sim@carbonos.ai');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    await page.goto('/twin');
    await expect(page.locator('h1').last()).toContainText('AI Carbon Twin');
    
    // Simulate changing commute slider
    const slider = page.locator('input[type="range"]').first();
    await slider.focus();
    await slider.fill('45'); // set commute distance to 45 miles
    
    // Verify distance text is updated dynamically in real-time
    await expect(page.locator('body')).toContainText('45 miles');

    // Simulate changing diet engine
    await page.selectOption('select', 'vegan');
    
    // Commit simulated configurations back to profile
    await page.click('button:has-text("Commit Twin Settings")');
    
    // Assert successful sync response badge
    await expect(page.locator('body')).toContainText('Profile Synchronized!');
  });

  test('3. AI Sustainability Coach Queries', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email-input', 'coach-user@carbonos.ai');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    await page.goto('/coach');
    await expect(page.locator('h1').last()).toContainText('Sustainability Coach');
    
    // Verify initial welcome bubble
    await expect(page.locator('body')).toContainText('powered by Gemini 2.5 Pro');

    // Query the AI coach
    await page.fill('input[placeholder*="Ask about carbon reduction"]', 'How does solar panel installation lower home energy carbon?');
    await page.click('form button[type="submit"]');
    
    // Verify typing indicator shows, then AI responds with a text bubble
    await expect(page.locator('body')).toContainText('home energy carbon footprint depends directly');
  });

  test('4. Marketplace Point Redemptions', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email-input', 'shopper@carbonos.ai');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    await page.goto('/marketplace');
    await expect(page.locator('h1').last()).toContainText('Rewards Marketplace');
    
    // Verify start points (should be 620 pts starting balance)
    await expect(page.locator('body')).toContainText('620 Green Points');

    // Attempt purchase of high-cost reward (should show "Need Points" or button disabled)
    const forestRedeemBtn = page.locator('button:has-text("Need Points")').first();
    await expect(forestRedeemBtn).toBeDisabled();

    // Seed points in localStorage to simulate active reward purchase
    await page.evaluate(() => {
      const profile = JSON.parse(localStorage.getItem('carbonos_user_profile') || 'null');
      if (profile) {
        profile.greenPoints = 950; // enough credit
        localStorage.setItem('carbonos_user_profile', JSON.stringify(profile));
      }
    });
    
    // Refresh page to load seeded points
    await page.reload();
    await expect(page.locator('body')).toContainText('950 Green Points');

    // Redeem first available reward (e.g. Plant 10 Trees, cost 500 pts)
    await page.click('button:has-text("Redeem Item")');

    // Assert points deducted and item marked redeemed
    await expect(page.locator('body')).toContainText('Successfully redeemed');
    await expect(page.locator('body')).toContainText('450 Green Points');
  });

  test('5. Digital Footprint Sliders & Logger', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email-input', 'digital@carbonos.ai');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    await page.goto('/digital');
    await expect(page.locator('h1').last()).toContainText('Digital Carbon Calculator');

    // Adjust range inputs
    const range = page.locator('#emails-input');
    await range.fill('80');

    // Log the output
    await page.click('button:has-text("Log Digital Output")');
    await expect(page.locator('body')).toContainText('Log Saved!');
  });

  test('6. Travel Analyzer Distance Logging', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email-input', 'traveler@carbonos.ai');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    await page.goto('/travel');
    await expect(page.locator('h1').last()).toContainText('Travel Footprint Analyzer');

    // Fill distance
    await page.fill('#distance-input', '65');

    // Log trip
    await page.click('button:has-text("Log Journey")');
    await expect(page.locator('body')).toContainText('Trip Logged!');
  });

  test('7. Receipt OCR Simulation & Daily Log Additions', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email-input', 'scanner@carbonos.ai');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    await page.goto('/receipts');
    await expect(page.locator('h1').last()).toContainText('Receipt & Bill Scanner');

    // Trigger simulation preset
    await page.click('button:has-text("Simulate Grocery Receipt")');

    // Wait for OCR result elements to be rendered
    await expect(page.locator('body')).toContainText('GreenFoods Cooperative');

    // Click Add scanned total to logs
    await page.click('button:has-text("Add Scanned Total to Logs")');
    await expect(page.locator('body')).toContainText('Added to Daily Log!');
  });

  test('8. Eco Grid Load Relief Advisories', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email-input', 'alerts-user@carbonos.ai');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    await page.goto('/alerts');
    await expect(page.locator('h1').last()).toContainText('Eco Alerts');

    // Check off the first alert task
    await page.click('button:has-text("I Did This")');
    await expect(page.locator('body')).toContainText('Action Checked!');
  });

  test('9. Green Challenges Tab & Progress Increments', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email-input', 'challenger@carbonos.ai');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    await page.goto('/community');
    await expect(page.locator('h1').last()).toContainText('Community Hub');

    // Switch to Green Challenges tab
    await page.click('button:has-text("Green Challenges")');

    // Join the first challenge
    await page.click('button:has-text("Join Goal Target")');

    // Perform challenge progress action
    await page.click('button:has-text("Perform Action")');

    // Assert progress updated
    await expect(page.locator('body')).toContainText('35%');
  });
});
