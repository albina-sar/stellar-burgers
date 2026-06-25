# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: constructor.spec.ts >> Страница конструктора бургера >> должен добавлять ингредиент в конструктор
- Location: tests\constructor.spec.ts:60:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.burger_constructor .element')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.burger_constructor .element')

```

```yaml
- banner:
  - navigation:
    - link "Конструктор":
      - /url: /
      - img
      - paragraph: Конструктор
    - link "Лента заказов":
      - /url: /feed
      - img
      - paragraph: Лента заказов
    - link:
      - /url: /
      - img
    - link "Личный кабинет":
      - /url: /profile
      - img
      - paragraph: Личный кабинет
- main:
  - heading "Соберите бургер" [level=1]
  - navigation:
    - list: Булки Начинки Соусы
  - heading "Булки" [level=3]
  - list:
    - listitem:
      - link "2 картинка ингредиента. 1255 Краторная булка N-200i":
        - /url: /ingredients/643d69a5c3f7b9001cfa093c
        - paragraph: "2"
        - img "картинка ингредиента."
        - paragraph: "1255"
        - img
        - paragraph: Краторная булка N-200i
      - button "Добавить":
        - img
        - text: Добавить
  - heading "Начинки" [level=3]
  - list:
    - listitem:
      - link "картинка ингредиента. 424 Биокотлета из марсианской Магнолии":
        - /url: /ingredients/643d69a5c3f7b9001cfa0941
        - img "картинка ингредиента."
        - paragraph: "424"
        - img
        - paragraph: Биокотлета из марсианской Магнолии
      - button "Добавить":
        - img
        - text: Добавить
  - heading "Соусы" [level=3]
  - list:
    - listitem:
      - link "картинка ингредиента. 80 Соус фирменный Space Sauce":
        - /url: /ingredients/643d69a5c3f7b9001cfa0943
        - img "картинка ингредиента."
        - paragraph: "80"
        - img
        - paragraph: Соус фирменный Space Sauce
      - button "Добавить":
        - img
        - text: Добавить
  - img "Краторная булка N-200i (верх)"
  - text: Краторная булка N-200i (верх) 1255
  - img
  - img
  - list: Выберите начинку
  - img "Краторная булка N-200i (низ)"
  - text: Краторная булка N-200i (низ) 1255
  - img
  - img
  - paragraph: "2510"
  - img
  - button "Оформить заказ"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Страница конструктора бургера', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Перехватываем запрос на ингредиенты и возвращаем моковые данные
  6   |     await page.route('**/api/ingredients', async (route) => {
  7   |       await route.fulfill({
  8   |         status: 200,
  9   |         contentType: 'application/json',
  10  |         body: JSON.stringify({
  11  |           success: true,
  12  |           data: [
  13  |             {
  14  |               _id: '643d69a5c3f7b9001cfa093c',
  15  |               name: 'Краторная булка N-200i',
  16  |               type: 'bun',
  17  |               proteins: 80,
  18  |               fat: 24,
  19  |               carbohydrates: 53,
  20  |               calories: 420,
  21  |               price: 1255,
  22  |               image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  23  |               image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  24  |               image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  25  |             },
  26  |             {
  27  |               _id: '643d69a5c3f7b9001cfa0941',
  28  |               name: 'Биокотлета из марсианской Магнолии',
  29  |               type: 'main',
  30  |               proteins: 420,
  31  |               fat: 142,
  32  |               carbohydrates: 242,
  33  |               calories: 4242,
  34  |               price: 424,
  35  |               image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  36  |               image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  37  |               image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  38  |             },
  39  |             {
  40  |               _id: '643d69a5c3f7b9001cfa0943',
  41  |               name: 'Соус фирменный Space Sauce',
  42  |               type: 'sauce',
  43  |               proteins: 50,
  44  |               fat: 22,
  45  |               carbohydrates: 11,
  46  |               calories: 14,
  47  |               price: 80,
  48  |               image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  49  |               image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
  50  |               image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  51  |             },
  52  |           ],
  53  |         }),
  54  |       });
  55  |     });
  56  | 
  57  |     await page.goto('/');
  58  |   });
  59  | 
  60  |   test('должен добавлять ингредиент в конструктор', async ({ page }) => {
  61  |     // Находим первый ингредиент и нажимаем "Добавить"
  62  |     const addButton = page.locator('button:has-text("Добавить")').first();
  63  |     await addButton.click();
  64  | 
  65  |     // Проверяем, что ингредиент появился в конструкторе
  66  |     const constructorElement = page.locator('.burger_constructor .element');
> 67  |     await expect(constructorElement).toBeVisible();
      |                                      ^ Error: expect(locator).toBeVisible() failed
  68  |   });
  69  | 
  70  |   test('должен открывать модальное окно ингредиента по клику', async ({ page }) => {
  71  |     // Находим первый ингредиент и кликаем по нему
  72  |     const ingredient = page.locator('.burger_ingredients .article').first();
  73  |     await ingredient.click();
  74  | 
  75  |     // Проверяем, что модальное окно открылось
  76  |     const modal = page.locator('.modal');
  77  |     await expect(modal).toBeVisible();
  78  |   });
  79  | 
  80  |   test('должен закрывать модальное окно по клику на крестик', async ({ page }) => {
  81  |     // Открываем модалку
  82  |     const ingredient = page.locator('.burger_ingredients .article').first();
  83  |     await ingredient.click();
  84  | 
  85  |     // Закрываем по крестику
  86  |     const closeButton = page.locator('.modal .button');
  87  |     await closeButton.click();
  88  | 
  89  |     // Проверяем, что модалка закрылась
  90  |     const modal = page.locator('.modal');
  91  |     await expect(modal).toBeHidden();
  92  |   });
  93  | 
  94  |   test('должен закрывать модальное окно по клику на оверлей', async ({ page }) => {
  95  |     // Открываем модалку
  96  |     const ingredient = page.locator('.burger_ingredients .article').first();
  97  |     await ingredient.click();
  98  | 
  99  |     // Кликаем на оверлей
  100 |     const overlay = page.locator('.overlay');
  101 |     await overlay.click();
  102 | 
  103 |     // Проверяем, что модалка закрылась
  104 |     const modal = page.locator('.modal');
  105 |     await expect(modal).toBeHidden();
  106 |   });
  107 | });
  108 | 
  109 | test.describe('Создание заказа', () => {
  110 |   test.beforeEach(async ({ page }) => {
  111 |     // Мок для ингредиентов
  112 |     await page.route('**/api/ingredients', async (route) => {
  113 |       await route.fulfill({
  114 |         status: 200,
  115 |         contentType: 'application/json',
  116 |         body: JSON.stringify({
  117 |           success: true,
  118 |           data: [
  119 |             {
  120 |               _id: '643d69a5c3f7b9001cfa093c',
  121 |               name: 'Краторная булка N-200i',
  122 |               type: 'bun',
  123 |               proteins: 80,
  124 |               fat: 24,
  125 |               carbohydrates: 53,
  126 |               calories: 420,
  127 |               price: 1255,
  128 |               image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  129 |               image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  130 |               image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  131 |             },
  132 |             {
  133 |               _id: '643d69a5c3f7b9001cfa0941',
  134 |               name: 'Биокотлета из марсианской Магнолии',
  135 |               type: 'main',
  136 |               proteins: 420,
  137 |               fat: 142,
  138 |               carbohydrates: 242,
  139 |               calories: 4242,
  140 |               price: 424,
  141 |               image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  142 |               image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  143 |               image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  144 |             },
  145 |           ],
  146 |         }),
  147 |       });
  148 |     });
  149 | 
  150 |     // Мок для пользователя
  151 |     await page.route('**/api/auth/user', async (route) => {
  152 |       await route.fulfill({
  153 |         status: 200,
  154 |         contentType: 'application/json',
  155 |         body: JSON.stringify({
  156 |           success: true,
  157 |           user: {
  158 |             email: 'test@test.com',
  159 |             name: 'Test User',
  160 |           },
  161 |         }),
  162 |       });
  163 |     });
  164 | 
  165 |     // Мок для создания заказа
  166 |     await page.route('**/api/orders', async (route) => {
  167 |       await route.fulfill({
```