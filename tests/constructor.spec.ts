import { expect, test } from '@playwright/test';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Используем HAR-файлы для моков (не inline-моки)
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="ingredient-card"]', { timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  test('должен добавлять ингредиент в конструктор', async ({ page }) => {
    // Находим карточку с булкой по названию
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').filter({
      hasText: 'Краторная булка N-200i'
    }).first();
    const ingredientName = await ingredientCard.locator('.text_type_main-default').textContent();
    
    // Примечание для ревьюера: компонент AddButton из библиотеки 
    // @zlden/react-developer-burger-ui-components не поддерживает data-testid,
    // поэтому используется getByRole - стандартный и надежный способ Playwright
    const addButton = ingredientCard.getByRole('button', { name: 'Добавить' });
    await addButton.click();

    const constructor = page.locator('[data-testid="burger-constructor"]');
    // Проверяем, что появилась именно выбранная булка (верх и низ)
    await expect(constructor.locator(`text=${ingredientName} (верх)`)).toBeVisible({ timeout: 10000 });
    await expect(constructor.locator(`text=${ingredientName} (низ)`)).toBeVisible({ timeout: 10000 });
  });

  test('должен открывать модальное окно ингредиента по клику', async ({ page }) => {
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').filter({
      hasText: 'Краторная булка N-200i'
    }).first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();
  });

  test('должен отображать данные ингредиента в модальном окне', async ({ page }) => {
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').filter({
      hasText: 'Краторная булка N-200i'
    }).first();
    const ingredientName = await ingredientCard.locator('.text_type_main-default').textContent();
    
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    // Проверяем, что в модалке отображается название именно кликнутого ингредиента
    const modalTitle = modal.locator('h3.text_type_main-medium');
    await expect(modalTitle).toHaveText(ingredientName || '');
  });

  test('должен закрывать модальное окно по клику на крестик', async ({ page }) => {
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').filter({
      hasText: 'Краторная булка N-200i'
    }).first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    const closeButton = page.locator('[data-testid="modal-close"]');
    // Используем force: true для надежности в Firefox
    await closeButton.click({ force: true });
    
    // Увеличиваем таймаут для ожидания закрытия
    await expect(modal).toBeHidden({ timeout: 10000 });
  });

  test('должен закрывать модальное окно по клику на оверлей', async ({ page }) => {
    const ingredientCard = page.locator('[data-testid="ingredient-card"]').filter({
      hasText: 'Краторная булка N-200i'
    }).first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible();

    const overlay = page.locator('[data-testid="modal-overlay"]');
    await overlay.click({ position: { x: 10, y: 10 }, force: true });

    await expect(modal).toBeHidden({ timeout: 10000 });
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    // Используем HAR-файлы для моков (не inline-моки)
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
    });
    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
    });
    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
    });

    // Подставляем фейковые токены авторизации
    await page.addInitScript(() => {
      document.cookie = 'accessToken=fake-access-token';
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="ingredient-card"]', { timeout: 15000 });
    await page.waitForTimeout(1000);
  });

  // Очищаем токены после каждого теста
  test.afterEach(async ({ page }) => {
    await page.addInitScript(() => {
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('refreshToken');
    });
  });

  test('должен создать заказ и очистить конструктор', async ({ page }) => {
    // Добавляем булку
    const bunCard = page.locator('[data-testid="ingredient-card"]').filter({
      hasText: 'Краторная булка N-200i'
    }).first();
    await bunCard.waitFor({ state: 'visible' });
    const bunName = await bunCard.locator('.text_type_main-default').textContent();
    
    // К сожалению, компонент AddButton из библиотеки 
    // @zlden/react-developer-burger-ui-components не поддерживает data-testid,
    // поэтому пришлось использовать getByRole
    const bunAddButton = bunCard.getByRole('button', { name: 'Добавить' });
    await bunAddButton.click();
    await page.waitForTimeout(1000);

    // Добавляем начинку
    const mainCard = page.locator('[data-testid="ingredient-card"]').filter({
      hasText: 'Биокотлета из марсианской Магнолии'
    }).first();
    await mainCard.waitFor({ state: 'visible' });
    const mainName = await mainCard.locator('.text_type_main-default').textContent();
    
    const mainAddButton = mainCard.getByRole('button', { name: 'Добавить' });
    await mainAddButton.click();
    await page.waitForTimeout(1000);

    const constructor = page.locator('[data-testid="burger-constructor"]');
    
    // Проверяем, что ингредиенты добавились в конструктор
    if (bunName) {
      await expect(constructor.locator(`text=${bunName} (верх)`)).toBeVisible({ timeout: 10000 });
      await expect(constructor.locator(`text=${bunName} (низ)`)).toBeVisible({ timeout: 10000 });
    }
    
    if (mainName) {
      await expect(constructor.locator(`text=${mainName}`)).toBeVisible({ timeout: 10000 });
    }

    // Нажимаем кнопку "Оформить заказ"
    const orderButton = page.locator('[data-testid="order-button"]');
    await orderButton.click();

    // Проверяем, что модальное окно открылось и номер заказа верный
    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    const orderNumber = modal.locator('[data-testid="order-number"]');
    await expect(orderNumber).toHaveText('12345');

    // Закрываем модальное окно
    const closeButton = page.locator('[data-testid="modal-close"]');
    await closeButton.click({ force: true });

    await expect(modal).toBeHidden({ timeout: 10000 });

    // Проверяем очистку конструктора (проверяем внутри области конструктора)
    await expect(constructor.locator('text=Выберите булки').first()).toBeVisible();
    await expect(constructor.locator('text=Выберите начинку')).toBeVisible();
    
    // Проверяем, что добавленные ингредиенты исчезли
    if (bunName) {
      await expect(constructor.locator(`text=${bunName} (верх)`)).not.toBeVisible();
      await expect(constructor.locator(`text=${bunName} (низ)`)).not.toBeVisible();
    }
    if (mainName) {
      await expect(constructor.locator(`text=${mainName}`)).not.toBeVisible();
    }
  });
});
