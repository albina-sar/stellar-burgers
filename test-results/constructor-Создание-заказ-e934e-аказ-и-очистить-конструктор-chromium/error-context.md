# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: constructor.spec.ts >> Создание заказа >> должен создать заказ и очистить конструктор
- Location: tests\constructor.spec.ts:195:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.modal')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.modal')

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
    - link "Test User":
      - /url: /profile
      - img
      - paragraph: Test User
- main:
  - heading "Соберите бургер" [level=1]
  - navigation:
    - list: Булки Начинки Соусы
  - heading "Булки" [level=3]
  - list:
    - listitem:
      - link "картинка ингредиента. 1255 Краторная булка N-200i":
        - /url: /ingredients/643d69a5c3f7b9001cfa093c
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
  - list
  - text: Выберите булки
  - list: Выберите начинку
  - text: Выберите булки
  - paragraph: "0"
  - img
  - button "Оформить заказ" [disabled]
- heading [level=3]
- button:
  - img
- heading "12345" [level=2]
- paragraph: идентификатор заказа
- img "изображение статуса заказа."
- paragraph: Ваш заказ начали готовить
- paragraph: Дождитесь готовности на орбитальной станции
```

# Test source

```ts
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
  168 |         status: 200,
  169 |         contentType: 'application/json',
  170 |         body: JSON.stringify({
  171 |           success: true,
  172 |           order: {
  173 |             _id: '123456',
  174 |             status: 'done',
  175 |             name: 'Test Burger',
  176 |             createdAt: new Date().toISOString(),
  177 |             updatedAt: new Date().toISOString(),
  178 |             number: 12345,
  179 |             price: 1679,
  180 |           },
  181 |           name: 'Test Burger',
  182 |         }),
  183 |       });
  184 |     });
  185 | 
  186 |     // Устанавливаем токены
  187 |     await page.addInitScript(() => {
  188 |       document.cookie = 'accessToken=fake-token';
  189 |       localStorage.setItem('refreshToken', 'fake-refresh-token');
  190 |     });
  191 | 
  192 |     await page.goto('/');
  193 |   });
  194 | 
  195 |   test('должен создать заказ и очистить конструктор', async ({ page }) => {
  196 |     // Добавляем булку
  197 |     const addBunButton = page.locator('button:has-text("Добавить")').first();
  198 |     await addBunButton.click();
  199 | 
  200 |     // Добавляем начинку
  201 |     const addMainButton = page.locator('button:has-text("Добавить")').nth(1);
  202 |     await addMainButton.click();
  203 | 
  204 |     // Оформляем заказ
  205 |     const orderButton = page.locator('button:has-text("Оформить заказ")');
  206 |     await orderButton.click();
  207 | 
  208 |     // Проверяем, что модалка открылась
  209 |     const modal = page.locator('.modal');
> 210 |     await expect(modal).toBeVisible();
      |                         ^ Error: expect(locator).toBeVisible() failed
  211 | 
  212 |     // Проверяем номер заказа
  213 |     const orderNumber = page.locator('.modal .text_type_digits-large');
  214 |     await expect(orderNumber).toHaveText('12345');
  215 | 
  216 |     // Закрываем модалку
  217 |     const closeButton = page.locator('.modal .button');
  218 |     await closeButton.click();
  219 | 
  220 |     // Проверяем, что конструктор пуст
  221 |     const noBunsMessage = page.locator('text=Выберите булки');
  222 |     await expect(noBunsMessage).toBeVisible();
  223 |   });
  224 | });
  225 | 
```