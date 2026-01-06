import { test, expect } from '@playwright/test';
import { executerActionsPanier } from './saucedemoscenario.js';

test('Exécution automatique pour tous les utilisateurs', async ({ page }) => {
  test.setTimeout(180000); 

  await page.goto('https://www.saucedemo.com/');

  const usernames = await page.locator('#login_credentials').innerText();
  const passwordText = await page.locator('.login_password').innerText();
  
  const userList = usernames.split('\n').filter(u => u && !u.includes('Accepted usernames'));
  const password = passwordText.split('\n')[1];

  for (const user of userList) {
    console.log(`\n🤖 Traitement de : ${user}`);

    try {
      // 1. Login
      await page.fill('#user-name', user);
      await page.fill('#password', password);
      await page.click('#login-button');

      // 2. Vérification immédiate si bloqué (ton IF actuel)
      const errorLocator = page.locator('[data-test="error"]');
      if (await errorLocator.isVisible()) {
        console.error(`❌ ${user} est un utilisateur bloqué.`);
        await page.reload();
        continue;
      }

      // 3. Appel du scénario avec protection contre les erreurs
      // On entoure l'appel par un try/catch pour que si le panier échoue, 
      // on passe quand même à l'utilisateur suivant.
      await executerActionsPanier(page, user);
      
      console.log(`✅ Dossier terminé avec succès pour ${user}`);

    } catch (error) {
      console.error(`⚠️ ERREUR pour ${user} : Le scénario a échoué (Bug site ?)`);
      // En cas d'erreur dans le scénario, on force un retour à l'accueil
      // pour que l'utilisateur suivant puisse tenter de se connecter.
      await page.goto('https://www.saucedemo.com/');
    }
  }
});