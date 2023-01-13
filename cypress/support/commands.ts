export { };
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      openHomepage(): Chainable<void>
      loginToApplication(): Chainable<void>
      //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

/**
 * Simple custom command to open homepage
 */
Cypress.Commands.add("openHomepage", (): void => {
  cy.visit("/");
});


/**
 * Custom command to login via API to angular-realworld-example-app
 */
Cypress.Commands.add("loginToApplication", () => {

  //API login request 
  cy.log("Logging via API with hidden credentials")
  cy.request({
    method: 'POST',
    url: "https://"+Cypress.env('apiUrl')+"api/users/login",
    log: false,
    body: { user: { email: Cypress.env('email_api'), password: Cypress.env('password_api'), } }
  }).its('body', { log: false }).then(body => {
    //retrieval of auth token
    const token = body.user.token
    //auth token will also be required by eg. post new article API request so it's worth to save it for future use
    cy.wrap(token).as('loginToken')

    //token with auth data shall be loaded before login page loads
    cy.visit('/', {
      onBeforeLoad(win) {
        //jwtToken is responsible for user authorisation
        win.localStorage.setItem('jwtToken', token)
      }
    })
  })
})  