import 'cypress-plugin-snapshots/commands'

const WIDTH = 450
const HEIGHT = 800

describe('bottom sheet', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        cy.viewport(WIDTH, HEIGHT)
        cy.visit('localhost:5000/labeler/2985')
    })

    it('contains seven colors', () => {
        cy.get('.color-row').children().should('have.length', 6)
        cy.wait(250)
        cy.get('.color-row').toMatchImageSnapshot()
    })

    it('should toggle open on swipe up and down', () => {
        cy.get('.sheet').not('.open')
        cy.dragSheet(20, -450)
        cy.get('.sheet.open')
        cy.wait(500)
        cy.get('.sheet').toMatchImageSnapshot()
        cy.dragSheet(20, 450)
        cy.get('.sheet').not('.open')
    })

    // TODO Shows tutorial & modal renders correctly
    // TODO Check error screen - Failed to fetch on some large id
})