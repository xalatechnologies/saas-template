import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Should redirect to login if not authenticated
  await expect(page).toHaveURL('/login');
  
  // Check login form is present
  await expect(page.locator('h1')).toContainText('Logg inn');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('login flow works', async ({ page }) => {
  await page.goto('/login');
  
  // Fill in demo credentials
  await page.fill('input[type="email"]', 'demo@example.com');
  await page.fill('input[type="password"]', 'password123');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Should redirect to dashboard
  await expect(page).toHaveURL('/');
  
  // Check dashboard content
  await expect(page.locator('h1')).toContainText('Velkommen tilbake');
});

test('accessibility - keyboard navigation', async ({ page }) => {
  await page.goto('/login');
  
  // Test tab navigation
  await page.keyboard.press('Tab');
  await expect(page.locator('input[type="email"]')).toBeFocused();
  
  await page.keyboard.press('Tab');
  await expect(page.locator('input[type="password"]')).toBeFocused();
  
  await page.keyboard.press('Tab');
  await expect(page.locator('button[type="submit"]')).toBeFocused();
});

test('responsive design', async ({ page }) => {
  // Test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/login');
  
  // Check mobile layout
  const card = page.locator('.max-w-lg');
  await expect(card).toBeVisible();
  
  // Test desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(card).toBeVisible();
});