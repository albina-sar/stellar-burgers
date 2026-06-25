import { test, expect } from '@playwright/test';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Перехватываем запрос на ингредиенты и возвращаем моковые данные
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              _id: '643d69a5c3f7b9001cfa093c',
              name: 'Краторная булка N-200i',
              type: 'bun',
              proteins: 80,
              fat: 24,
              carbohydrates: 53,
              calories: 420,
              price: 1255,
              image: 'https://code.s3.yandex.net/react/code/bun-02.png',
              image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
            },
            {
              _id: '643d69a5c3f7b9001cfa0941',
              name: 'Биокотлета из марсианской Магнолии',
              type: 'main',
              proteins: 420,
              fat: 142,
              carbohydrates: 242,
              calories: 4242,
              price: 424,
              image: 'https://code.s3.yandex.net/react/code/meat-01.png',
              image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
            },
            {
              _id: '643d69a5c3f7b9001cfa0943',
              name: 'Соус фирменный Space Sauce',
              type: 'sauce',
              proteins: 50,
              fat: 22,
              carbohydrates: 11,
              calories: 14,
              price: 80,
              image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
              image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
            },
          ],
        }),
      });
    });

    await page.goto('/');
  });

  test('должен добавлять ингредиент в конструктор', async ({ page }) => {
    // Находим первый ингредиент и нажимаем "Добавить"
    const addButton = page.locator('button:has-text("Добавить")').first();
    await addButton.click();

    // Проверяем, что ингредиент появился в конструкторе
    const constructorElement = page.locator('.burger_constructor .element');
    await expect(constructorElement).toBeVisible();
  });

  test('должен открывать модальное окно ингредиента по клику', async ({ page }) => {
    // Находим первый ингредиент и кликаем по нему
    const ingredient = page.locator('.burger_ingredients .article').first();
    await ingredient.click();

    // Проверяем, что модальное окно открылось
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();
  });

  test('должен закрывать модальное окно по клику на крестик', async ({ page }) => {
    // Открываем модалку
    const ingredient = page.locator('.burger_ingredients .article').first();
    await ingredient.click();

    // Закрываем по крестику
    const closeButton = page.locator('.modal .button');
    await closeButton.click();

    // Проверяем, что модалка закрылась
    const modal = page.locator('.modal');
    await expect(modal).toBeHidden();
  });

  test('должен закрывать модальное окно по клику на оверлей', async ({ page }) => {
    // Открываем модалку
    const ingredient = page.locator('.burger_ingredients .article').first();
    await ingredient.click();

    // Кликаем на оверлей
    const overlay = page.locator('.overlay');
    await overlay.click();

    // Проверяем, что модалка закрылась
    const modal = page.locator('.modal');
    await expect(modal).toBeHidden();
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    // Мок для ингредиентов
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              _id: '643d69a5c3f7b9001cfa093c',
              name: 'Краторная булка N-200i',
              type: 'bun',
              proteins: 80,
              fat: 24,
              carbohydrates: 53,
              calories: 420,
              price: 1255,
              image: 'https://code.s3.yandex.net/react/code/bun-02.png',
              image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
            },
            {
              _id: '643d69a5c3f7b9001cfa0941',
              name: 'Биокотлета из марсианской Магнолии',
              type: 'main',
              proteins: 420,
              fat: 142,
              carbohydrates: 242,
              calories: 4242,
              price: 424,
              image: 'https://code.s3.yandex.net/react/code/meat-01.png',
              image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
              image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
            },
          ],
        }),
      });
    });

    // Мок для пользователя
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'test@test.com',
            name: 'Test User',
          },
        }),
      });
    });

    // Мок для создания заказа
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: {
            _id: '123456',
            status: 'done',
            name: 'Test Burger',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            number: 12345,
            price: 1679,
          },
          name: 'Test Burger',
        }),
      });
    });

    // Устанавливаем токены
    await page.addInitScript(() => {
      document.cookie = 'accessToken=fake-token';
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.goto('/');
  });

  test('должен создать заказ и очистить конструктор', async ({ page }) => {
    // Добавляем булку
    const addBunButton = page.locator('button:has-text("Добавить")').first();
    await addBunButton.click();

    // Добавляем начинку
    const addMainButton = page.locator('button:has-text("Добавить")').nth(1);
    await addMainButton.click();

    // Оформляем заказ
    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await orderButton.click();

    // Проверяем, что модалка открылась
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();

    // Проверяем номер заказа
    const orderNumber = page.locator('.modal .text_type_digits-large');
    await expect(orderNumber).toHaveText('12345');

    // Закрываем модалку
    const closeButton = page.locator('.modal .button');
    await closeButton.click();

    // Проверяем, что конструктор пуст
    const noBunsMessage = page.locator('text=Выберите булки');
    await expect(noBunsMessage).toBeVisible();
  });
});
