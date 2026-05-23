import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import { Consumable } from 'src/models/consumable.interface';

@Injectable()
export class ScraperService {
  constructor() {}

  async loginAndScrape(): Promise<Consumable[]> {
    const browser = await chromium.launch({
      headless: false,
    });

    const page = await browser.newPage();
    await page.goto('https://www.web-scraping.dev/login');

    // caut campurile pentru credentials si le completez cu datele de test
    //USERNAME
    const usernameInput = page.getByLabel('Username');
    await usernameInput.fill('user123');

    //PASSWORD
    const passwordInput = page.getByLabel('Password');
    await passwordInput.fill('password');

    // click pe Submit button pentru login
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    await page.waitForLoadState('networkidle');

    await page.goto(
      'https://www.web-scraping.dev/products?category=consumables',
    );
    await page.waitForLoadState('networkidle');

    // selectam produsele gasite pe pagina de consumables
    const consumables: Consumable[] = [];
    while (true) {
      await page.waitForSelector('.product');

      const products = await page.locator('.product').evaluateAll((items) => {
        return items.map((item) => {
          const image = item.querySelector('img');
          const title = item.querySelector('h3')?.textContent?.trim() ?? '';
          const description =
            item.querySelector('.short-description')?.textContent?.trim() ?? '';
          const price = parseFloat(
            item.querySelector('.price')?.textContent?.trim() ?? '',
          );
          return {
            imageUrl: image?.src ?? '',
            title,
            description,
            price,
          };
        });
      });

      //verific daca exista un produs cu acelasi nume deja adaugat in lista de consumables
      products.forEach((product) => {
        const productTitle = product.title;
        if (
          !consumables.find((consumable) => consumable.title === productTitle)
        ) {
          consumables.push(product);
        }
      });

      //caut butonul de next de la paginator
      const nextButton = page.locator('a', { hasText: '>' });

      //TODO: ar trebui gasita o conditie de oprire mai generala care sa nu implice constante
      if (products.length < 5) {
        break;
      }
      await nextButton.click();
      await page.waitForLoadState('networkidle');
    }
    //returnez lista de consumables care urmeaza sa fie adaugata in DB
    await browser.close();
    return consumables;
  }
}
