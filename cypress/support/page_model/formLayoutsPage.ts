export class FormLayoutsPage {
    /**
     * Submits Inline Form on Form Layouts Page
     * @param {string} name 
     * @param {string} email 
     */
    submitInlineFormWithNameAndEmail(name:string, email:string) {
        cy.contains('nb-card', 'Inline form').find('form').then(form => {
            cy.wrap(form).find('[placeholder="Jane Doe"]').type(name)
            cy.wrap(form).find('[placeholder="Email"]').type(email)
            cy.wrap(form).find('[type="checkbox"]').check({ force: true })
            cy.wrap(form).submit()
        })
    }

    /**
     * Submits Basic Form on Form Layouts Page
     * @param {string} email 
     * @param {string} password 
     */
    submitBasicFormWithNameAndEmail(email:string, password:string) {
        cy.contains('nb-card', 'Basic form').find('form').then(form => {
            cy.wrap(form).find('[placeholder="Email"]').type(email)
            cy.wrap(form).find('[placeholder="Password"]').type(password)
            cy.wrap(form).find('[type="checkbox"]').check({ force: true })
            cy.wrap(form).submit()
        })
    }
}

export const onFormLayoutsPage = new FormLayoutsPage()