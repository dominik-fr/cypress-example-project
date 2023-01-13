export class SmartTable {

    /**
     * find row with given name and update age
     * @param {string} name 
     * @param {number} age 
     */
    updateAgeByFirstName(name: string, age: number) {
        cy.get('tbody').contains('tr', name).then(tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type(age.toString())
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', age)
        })
    }

    /**
     * Add new record with provided first and last name
     * @param {string} firstName 
     * @param {string} lastName 
     */
    addNewRecordWithFirstAndLastName(firstName: string, lastName: string) {
        cy.get('thead').find('.nb-plus').click()
        //index 0 for header, 1 for stub and 2 for newly added row 
        cy.get('thead').find('tr').eq(2).then(tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type(firstName)
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type(lastName)
            cy.wrap(tableRow).find('.nb-checkmark').click()
        })
        cy.get('tbody tr').first().find('td').then(tableColumns => {
            cy.wrap(tableColumns).eq(2).should('contain', firstName)
            cy.wrap(tableColumns).eq(3).should('contain', lastName)
        })
    }

    /**
     * Delete row with given index
     * @param {number} index 
     */
    deleteRowByIndex(index: number) {
        const stub = cy.stub()
        cy.on('window:confirm', stub)
        cy.get('tbody tr').eq(index).find('.nb-trash').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        })
    }
}

export const onSmartTablePage = new SmartTable()