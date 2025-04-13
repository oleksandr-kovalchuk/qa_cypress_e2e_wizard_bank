import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('GlobalsQa Bank App - Hermione Granger', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const secondaryAccountNumber = '1002';
  const currency = 'Dollar';

  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;

  const selectors = {
    customerLoginBtn: '.btn:contains("Customer Login")',
    loginBtn: '.btn:contains("Login")',
    userDropdown: '[name="userSelect"]',
    accountDropdown: '[name="accountSelect"]',
    accountInfo: '[ng-hide="noAccount"]',
    depositTab: '[ng-click="deposit()"]',
    withdrawTab: '[ng-click="withdrawl()"]',
    transactionTab: '[ng-click="transactions()"]',
    backBtn: '[ng-click="back()"]',
    logoutBtn: '[ng-click="byebye()"]',
    amountInput: '[placeholder="amount"]',
    submitBtn: '[type="submit"]',
    depositMsg: '[ng-show="message"]',
    transactionTable: 'table'
  };

  before(() => {
    cy.visit('/');
  });

  it('should handle full flow from login to transactions', () => {
    cy.get(selectors.customerLoginBtn).click();
    cy.get(selectors.userDropdown).select(user);
    cy.get(selectors.loginBtn).click();

    cy.get(selectors.accountInfo)
      .contains('strong', accountNumber)
      .should('be.visible');

    cy.get(selectors.accountInfo).contains('strong', '0').should('be.visible');

    cy.contains('.ng-binding', currency).should('be.visible');

    cy.get(selectors.depositTab).click();
    cy.get(selectors.amountInput).type(depositAmount);
    cy.get(selectors.submitBtn).contains('Deposit').click();

    cy.get(selectors.depositMsg).should('contain', 'Deposit Successful');

    cy.get(selectors.accountInfo).contains('Balance').should('be.visible');

    cy.get(selectors.withdrawTab).click();
    cy.get(selectors.amountInput).type(withdrawAmount);
    cy.get(selectors.submitBtn).contains('Withdraw').click();

    cy.get(selectors.transactionTab).click();
    cy.get(selectors.transactionTable).should('contain', 'Transaction Type');

    cy.get(selectors.backBtn).click();
    cy.get(selectors.accountDropdown).select(secondaryAccountNumber);
    cy.get(selectors.transactionTab).click();

    cy.get(selectors.transactionTable)
      .should('not.contain', 'Deposit')
      .and('not.contain', 'Withdraw');

    cy.get(selectors.backBtn).click();
    cy.get(selectors.logoutBtn).click();
  });
});
