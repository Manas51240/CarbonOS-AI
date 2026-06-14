import { test, expect } from '@playwright/test';

test.describe('CarbonOS AI - End-to-End User Journeys', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to local port and seed fresh LocalStorage profile
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('1. Onboarding & Login Flow', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Check brand header is visible
    await expect(page.locator('h1')).toContainText('CarbonOS');
    
    // Fill credentials in sandbox mode
    await page.fill('#email-input', 'e2e-tester@carbonos.ai');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Assert redirect to console dashboard
    await page.waitForURL('**/');
    await expect(page.locator('h1')).toContainText('Console Dashboard');
    await expect(page.locator('body')).toContainText('E2e-tester');
  });

  test('2. AI Carbon Twin Simulation & Baseline Commits', async ({ page }) => {
    // Navigate straight to twin page
    await page.goto('/auth/login');
    await page.fill('#email-input', 'twin-sim@carbonos.ai');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    
    await page.goto('/twin');
    await expect(page.locator('h1')).toContainText('AI Carbon Twin');
    
    // Simulate changing commute slider
    const slider = page.locator('input[type="range"]');
    await slider.focus();
    await slider.fill('45'); // set commute distance to 45 miles
    
    // Verify distance text is updated dynamically in real-time
    await expect(page.locator('body')).toContainText('45 miles');

    // Simulate changing diet engine
    await page.selectOption('select', 'vegan');
    
    // Commit simulated configurations back to profile
    await page.click('button:has-text("Commit Twin Settings")');
    
    // Assert successful sync response badge
    await expect(page.locator('body')).toContainText('Profile Synchronized');
  });

  test('3. AI Sustainability Coach Queries', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email-input', 'coach-user@carbonos.ai');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    await page.goto('/coach');
    await expect(page.locator('h1')).toContainText('Sustainability Coach');
    
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
    await expect(page.locator('h1')).toContainText('Rewards Marketplace');
    
    // Verify start points (should be 200 pts starting balance)
    await expect(page.locator('body')).toContainText('200 Green Points');

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

    // Redeem cheaper reward (e.g. $10 organic clothing voucher, cost 300 pts)
    await page.click('button:has-text("Redeem Item")');

    // Assert points deducted and item marked redeemed
    await expect(page.locator('body')).toContainText('Successfully redeemed');
    await expect(page.locator('body')).toContainText('650 Green Points');
  });
});
