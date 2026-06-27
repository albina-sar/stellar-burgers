import { test, expect } from '@playwright/test';

const ingredientsMock = {
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
};

const userMock = {
  success: true,
  user: {
    email: 'test@test.com',
    name: 'Test User',
  },
};

const orderMock = {
  success: true,
  order: {
    _id: '123456',
    status: 'done',
    name: 'Test Burger',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    price: 1679,
  },
  name: 'Test Burger',
};

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ingredientsMock),
      });
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="ingredient-card"]', { timeout: 15000 });
  });

  test('должен добавлять ингредиент в конструктор', async ({ page }) => {
    const addButton = page
      .locator('[data-testid="ingredient-card"]')
      .first()
      .locator('button:has-text("Добавить")');
    await addButton.click();

    await page.waitForTimeout(500);

    const bunElement = page
      .locator('[data-testid="burger-constructor"]')
      .locator('text=Краторная булка N-200i (верх)');
    await expect(bunElement).toBeVisible();
  });

  test('должен открывать модальное окно ингредиента по клику', async ({ page }) => {
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    const ingredientName = modal.locator('text=Краторная булка N-200i');
    await expect(ingredientName).toBeVisible();
  });

  test('должен проверять данные ингредиента в модальном окне', async ({ page }) => {
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    const ingredientName = modal.locator('text=Краторная булка N-200i');
    await expect(ingredientName).toBeVisible();

    const calories = modal.locator('text=Калории, ккал').locator('..');
    await expect(calories.locator('text=420')).toBeVisible();
  });

  test('должен закрывать модальное окно по клику на крестик', async ({ page }) => {
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    const closeButton = page.locator('[data-testid="modal-close"]');
    await closeButton.click();

    await expect(modal).toBeHidden();
  });

  test('должен закрывать модальное окно по нажатию Escape', async ({ page }) => {
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(modal).toBeHidden();
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ingredientsMock),
      });
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(userMock),
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(orderMock),
      });
    });

    await page.addInitScript(() => {
      document.cookie = 'accessToken=fake-token';
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="ingredient-card"]', { timeout: 15000 });
  });

  test('должен создать заказ и очистить конструктор', async ({ page }) => {
    const bunAddButton = page
      .locator('[data-testid="ingredient-card"]')
      .first()
      .locator('button:has-text("Добавить")');
    await bunAddButton.click();

    const mainAddButton = page
      .locator('[data-testid="ingredient-card"]')
      .nth(1)
      .locator('button:has-text("Добавить")');
    await mainAddButton.click();

    const constructor = page.locator('[data-testid="burger-constructor"]');
    await expect(constructor.locator('text=Краторная булка N-200i (верх)')).toBeVisible();
    await expect(constructor.locator('text=Биокотлета из марсианской Магнолии')).toBeVisible();

    const orderButton = page.locator('[data-testid="order-button"]');
    await orderButton.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    const orderNumber = modal.locator('[data-testid="order-number"]');
    await expect(orderNumber).toHaveText('12345');

    const closeButton = page.locator('[data-testid="modal-close"]');
    await closeButton.click();

    // Ждем, пока модалка закроется
    await expect(modal).toBeHidden({ timeout: 10000 });

    // Небольшая задержка для Firefox
    await page.waitForTimeout(500);

    await expect(constructor.locator('text=Выберите булки').first()).toBeVisible();
    await expect(constructor.locator('text=Выберите начинку')).toBeVisible();
    await expect(constructor.locator('text=Краторная булка N-200i (верх)')).not.toBeVisible();
    await expect(constructor.locator('text=Биокотлета из марсианской Магнолии')).not.toBeVisible();
  });
});
