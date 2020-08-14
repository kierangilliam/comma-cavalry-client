import 'cypress-plugin-snapshots/commands'

describe('home', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        cy.viewport(450, 800)
        cy.visit('localhost:5000/')
    })

    it('shows onboarding if there are no images in progress', () => {
        window.localStorage.clear()
        cy.get('p').should('not.contain', 'in progress')
    })

    it('shows in progress', () => {
        window.localStorage.setItem('saved', JSON.stringify({
            '4525': {
                version: 1,
                paths: [],
            }
        }))
        cy.reload()
        cy.get('p').contains('in progress')
        cy.get('img').should('be.visible')
        cy.wait(400)
        // @ts-ignore TODO FIX
        cy.get('body').toMatchImageSnapshot()
    })

    // TODO label new image then navigate back, should show new in progress
    it('navigates to labeler', () => {
        cy.get('button').click()
        cy.location('pathname').should('contain', '/labeler/')
    })
})