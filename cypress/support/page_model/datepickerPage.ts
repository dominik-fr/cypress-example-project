//function selects future date basing on current date and provided days number
function selectDayFromCurrent(day:number) {
    let date = new Date()
    date.setDate(date.getDate() + day)

    let futureDay = date.getDate()
    let futureMonth = date.toLocaleString('en-US', { month: 'short' })
    let futureYear = date.getFullYear()
    let dateAssert = futureMonth + ' ' + futureDay + ', ' + futureYear

    cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {

        //as long as calendar is not on correct month and year
        if (!dateAttribute.includes(futureMonth) || !dateAttribute.includes(futureYear.toString())) {
            cy.get('[data-name="chevron-right"]').click()
            selectDayFromCurrent(day)

        } else {
            //otherwise the day is selected (bounding month days have to be handled though)
            cy.get('.day-cell').not('.bounding-month').contains(futureDay.toString()).click()
        }
    })
    return dateAssert
}

export class DatepickerPage {

    /**
     * Select future date on calendar
     * @param {number} dayFromToday 
     */
    selectCommonDatepickerDateFromToday(dayFromToday:number) {
        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            let dateAssert = selectDayFromCurrent(dayFromToday)
            cy.wrap(input).should('have.value', dateAssert)
        })
    }


    /**
     * Select future date range on calendar
     * @param {number} firstDay 
     * @param {number} secondDay 
     */
    selectDatepickerWithRangeFromToday(firstDay:number, secondDay:number) {
        cy.contains('nb-card', 'Datepicker With Range').find('input').then(input => {
            cy.wrap(input).click()
            let dateAssertFirst = selectDayFromCurrent(firstDay)
            let dateAssertSecond = selectDayFromCurrent(secondDay)
            const finalDate = dateAssertFirst + ' - ' + dateAssertSecond
            cy.wrap(input).invoke('prop', 'value').should('contain', finalDate)
        })
    }
}
export const onDatepickerPage = new DatepickerPage()