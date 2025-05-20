const testUrl = 'http://localhost:4000';

describe('Тестируем доступность приложения', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(testUrl);
  });

  it('Test of adding bun', function () {
    cy.get('[data-cy=bun_1_constructor]')
      .contains('Краторная булка N-200i')
      .should('not.exist');
    cy.get('[data-cy=bun_2_constructor]')
      .contains('Краторная булка N-200i')
      .should('not.exist');
    cy.get('[data-cy=bun_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=bun_1_constructor]')
      .contains('Краторная булка N-200i')
      .should('exist');
    cy.get('[data-cy=bun_2_constructor]')
      .contains('Краторная булка N-200i')
      .should('exist');
  });

  it('Test of adding main ingredients', function () {
    cy.get('[data-cy=ingredient_constructor]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('not.exist');
    cy.get('[data-cy=ingredient_constructor]')
      .contains('Соус Spicy-X')
      .should('not.exist');
    cy.get('[data-cy=main_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=ingredient_constructor]')
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
    cy.get('[data-cy=souce_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=ingredient_constructor]')
      .contains('Соус Spicy-X')
      .should('exist');
  });
});

describe('Order test', function () {
  this.beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'userData.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'sucessOrder.json' });
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );

    cy.setCookie('accessToken', 'test-accessToken');

    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  afterEach(function () {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  //Добавление ингредиентов и создание заказа
  it('Create sucess order test', function () {
    cy.get('[data-cy=bun_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=main_ingredients]').contains('Добавить').click();
    cy.get('[data-cy=souce_ingredients]').contains('Добавить').click();

    cy.get('[data-cy=order_button]')
      .contains('Оформить заказ')
      .should('exist')
      .click();

    cy.get('[data-cy=order_number]').contains('5023').should('exist');

    //Проверка закрытия модального окна при клике на крестик
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    //Проверка очищения конструктора от ингредиентов
    cy.get('[data-cy=burger-constructor]').should(
      'not.contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-cy=ingredient_constructor]').should(
      'not.contain',
      'Соус Spicy-X'
    );
    cy.get('[data-cy=ingredient_constructor]').should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );
  });
});

describe('Modal window test', function () {
  this.beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit(testUrl);
  });

  //открытие модального окна при клике на ингредиент в списке
  it('Ingredient modal window is opened', function () {
    cy.get('[data-cy=modal]').should('not.exist');
    cy.get('[data-cy=bun_ingredients]')
      .contains('Краторная булка N-200i')
      .click();
    cy.get('[data-cy=modal]')
      .contains('Краторная булка N-200i')
      .should('exist');
  });

  //закрытие модального окна при клике на крест
  it('Ingredient modal window is closed', function () {
    cy.get('[data-cy=bun_ingredients]')
      .contains('Краторная булка N-200i')
      .click();
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  //закрытие модального окна при клике на оверлей
  it('Ingredient modal window is closed by overlay cloick', function () {
    cy.get('[data-cy=bun_ingredients]')
      .contains('Краторная булка N-200i')
      .click();
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=overlay]')
      .should('exist')
      .click('topRight', { force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });
});
