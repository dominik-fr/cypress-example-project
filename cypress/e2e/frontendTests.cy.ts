import { navigateTo } from "../support/page_model/navigationPanel"
import { onFormLayoutsPage } from "../support/page_model/formLayoutsPage"
import { onSmartTablePage } from "../support/page_model/smartTablePage"
import { onDatepickerPage } from "../support/page_model/datepickerPage"

describe('Forms handling', () => {

  beforeEach('Open application', () => {
    //this method is in custom commands
    cy.openHomepage()
  })

  it('Locators and commands chaining example', () => {
    cy.contains('Forms').click()
    cy.contains('Form Layouts').click()
    cy.contains('Sign in').click()
    cy.contains('[status="warning"]', 'Sign in').as("warningBtn").click()
    cy.get("@warningBtn").should("have.css","background-color","rgb(255, 170, 0)")

    //recommended by cypress - create your own attributes (assuming access to app sourcecode) 
    cy.get('[data-cy="blockSubmitButton"]').click()
    cy.get('#inputEmail3')
      .parents('form')
      .find('button')
      .should('contain', 'Sign in')
      .parents('form')
      .find('nb-checkbox')
      .click()

    cy.get('[for="exampleInputEmail1"]')
      .should('contain', 'Email address')
      .should('have.class', 'label')
      .and('have.text', 'Email address')

    cy.contains('nb-card', 'Basic form')
      .find('nb-checkbox')
      .click()
      .find('.custom-checkbox')
      .invoke('attr', 'class')
      .should('contain', 'checked')

    cy.contains('nb-card', 'Using the Grid').then(firstForm => {
      //handling jQuery format
      const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text()
      expect(emailLabelFirst).to.equal('Email')

      //or wrap it for cypress format
      cy.wrap(firstForm).find('[for="inputPassword2"]').should('contain', 'Password')
      cy.wrap(firstForm).find('[type="radio"]').then(radioButtons => {
        cy.wrap(radioButtons)
          .first()
          .check({ force: true })
          .should('be.checked')
        cy.wrap(radioButtons)
          .eq(1)
          .check({ force: true })
        cy.wrap(radioButtons)
          .eq(0)
          .should('not.be.checked')
        cy.wrap(radioButtons)
          .eq(2)
          .should('be.disabled')
      })
    })
  });

  it('Page objects usage example', () => {
    navigateTo.formLayoutsPage()
    onFormLayoutsPage.submitInlineFormWithNameAndEmail('John', 'testmail@test.com')
    onFormLayoutsPage.submitBasicFormWithNameAndEmail('Jane', 'testpassword')
  })

  it('Tables and dialog boxes', () => {
    navigateTo.smartTablePage()

    onSmartTablePage.addNewRecordWithFirstAndLastName(Cypress.env('firstName'), Cypress.env('lastName'))
    onSmartTablePage.updateAgeByFirstName(Cypress.env('firstName'), Cypress.env('age'))
    onSmartTablePage.deleteRowByIndex(0)

  })

  it('Datepickers', () => {
    navigateTo.datpickerPage()
    onDatepickerPage.selectCommonDatepickerDateFromToday(370)
    onDatepickerPage.selectDatepickerWithRangeFromToday(7, 14)

  })
})