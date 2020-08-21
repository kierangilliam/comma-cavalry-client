import 'cypress-plugin-snapshots/commands'

const WIDTH = 450
const HEIGHT = 800

beforeEach(() => {
    cy.clearLocalStorage()

})

describe('bottom sheet', () => {
    beforeEach(() => {
        cy.viewport(WIDTH, HEIGHT)
        window.localStorage.setItem('showEditorTutorial', JSON.stringify(false))
        cy.visit('localhost:5000/labeler/2985')
    })

    it('contains seven colors', () => {
        cy.get('.color-row').children().should('have.length', 6)
        cy.wait(250)
        // @ts-ignore
        cy.get('.color-row').toMatchImageSnapshot({ failureThreshold: 0.05 })
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

    it('should toggle open on swipe up and down', () => {
        cy.get('.sheet').not('.open')
        cy.dragSheet(20, -450)
        cy.get('.sheet.open')
        cy.wait(500)
        cy.get('.sheet').toMatchImageSnapshot()
        cy.dragSheet(20, 450)
        cy.get('.sheet').not('.open')
    })
})

describe('loading screen', () => {
    beforeEach(() => {
        cy.viewport(WIDTH, HEIGHT)
        cy.visit('localhost:5000/labeler/12u381239')
    })

    it('redirects to home on cancel', () => {
        cy.get('a').contains('cancel').click()
        cy.location('pathname').should('not.contain', '/labeler/')
    })

    it('shows error screen', () => {
        cy.get('p').contains('Could not find image')

        cy.wait(1000)
        // @ts-ignore
        cy.get('img').toMatchImageSnapshot({ failureThreshold: 0.05 })

        cy.get('a').contains('go back').click()
        cy.location('pathname').should('not.contain', '/labeler/')
    })
})

describe('tutorial', () => {
    beforeEach(() => {
        cy.viewport(WIDTH, HEIGHT)
        cy.visit('localhost:5000/labeler/2985')
        cy.get('.modal')
        cy.wait(2000)
    })

    const roadText = 'All parts, anywhere nobody would look at you funny for driving.'

    const dragCarousel = (page: number) => {
        const y = 200
        const e = {
            force: true,
            pointerType: 'touch',
        }

        const xStart = page * 350
        const x = xStart - 200

        cy.get('.carousel')
            .wait(150)
            .trigger('pointerdown', xStart, y, e)
            .wait(250)
            .trigger('pointermove', xStart, y, e)
            .wait(250)
            .trigger('pointermove', x, y, e)
            .wait(250)
            .trigger('pointerup', x, y, e)
            .wait(1000)
    }

    it('is visible', () => {
        cy.get('.modal').should('be.visible')
        cy.get('.modal').contains('what to do')

        // has all three lines visible
        cy.get('.modal').contains('on the image').should('be.visible')
        cy.get('.modal').contains('creating a mask').should('be.visible')
        cy.get('.modal').contains('with a mask').should('be.visible')

        // Does not contain next step
        cy.get('.modal').contains(roadText).should('not.be.visible')

        cy.get('.modal').toMatchImageSnapshot()
    })

    it('can go to the next page', () => {
        dragCarousel(1)

        cy.get('.modal').contains('with a mask').should('not.be.visible')

        cy.get('.modal')
            .contains(roadText)
            .should('be.visible')
    })
})