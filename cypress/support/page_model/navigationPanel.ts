/**
 * support function for opening only closed menu positions
 * @param groupName 
 */
function selectMenuItem(groupName: string) {
    cy.contains('a', groupName).then(menu => {
        cy.wrap(menu).find('.expand-state g g').invoke('attr', 'data-name').then(attr => {
            //closed positions have "left arrow"; opened - "down"
            if (attr.includes('left')) {
                cy.wrap(menu).click()
            }
        })
    })
}

export class NavigationPanel {

    /**
     * Navigate to Form Layouts page
     */
    formLayoutsPage() {
        selectMenuItem('Forms')
        cy.contains('Form Layouts').click()
    }

    /**
     * Navigate to Smart Table page
     */
    smartTablePage() {
        selectMenuItem('Tables & Data')
        cy.contains('Smart Table').click()
    }

    /**
     * Navigate to Datepicker page
     */
    datpickerPage() {
        selectMenuItem('Forms')
        cy.contains('Datepicker').click()
    }
}

export const navigateTo = new NavigationPanel()