import { expect } from '@playwright/test';

export async function executerActionsPanier(page, username) {
  await expect(page).toHaveURL(/inventory.html/);

  // Ajout produit
  await page.locator('.inventory_item button').first().click();
  
  // Petite pause de 1s juste pour le plaisir des yeux
  await page.waitForTimeout(1000);

  // Panier
  await page.click('.shopping_cart_link');
  await expect(page.locator('.cart_item')).toHaveCount(1);
  
  await page.waitForTimeout(1000);

  // Logout
  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');
  
  await expect(page).toHaveURL('https://www.saucedemo.com/');
}