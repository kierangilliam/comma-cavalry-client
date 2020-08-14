import 'cypress-plugin-snapshots/commands'

const WIDTH = 450
const HEIGHT = 800

describe('bottom sheet', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        cy.viewport(WIDTH, HEIGHT)
        cy.visit('localhost:5000/labeler/2985')
    })

    function dragSheet(yStart: number, yDiff: number) {
        const x = WIDTH / 2
        const e = {
            force: true,
            pointerType: 'touch',
        }

        cy.get('.sheet')
            .wait(150)
            .trigger('pointerdown', x, yStart, e)
            .wait(150)
            .trigger('pointermove', x, yDiff, e)
            .wait(150)
            .trigger('pointerup', x, yDiff, e)
            .wait(150)
    }

    it('contains seven colors', () => {
        cy.get('.color-row').children().should('have.length', 6)
        cy.wait(250)
        // @ts-ignore
        cy.get('.color-row').toMatchImageSnapshot()
    })

    it('should toggle open on swipe up and down', () => {
        cy.get('.sheet').not('.open')
        dragSheet(20, -450)
        cy.get('.sheet.open')
        cy.wait(500)
        // @ts-ignore
        cy.get('.sheet').toMatchImageSnapshot()
        dragSheet(20, 450)
        cy.get('.sheet').not('.open')
    })

    // TODO Check error screen - Failed to fetch on some large id
})