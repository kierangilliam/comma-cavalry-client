import 'cypress-plugin-snapshots/commands'

describe('e2e', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        cy.viewport(400, 850)
        cy.visit('localhost:5000/')
    })

    // TODO It should show the editor tutorial on first visit

    it('navigates to labeler, saves image, and navigates back to a visible in progress', () => {
        window.localStorage.setItem('showEditorTutorial', JSON.stringify(false))
        cy.reload()

        cy.get('button').click()
        cy.location('pathname').should('contain', '/labeler/')

        cy.get('.sheet').should('be.visible')
        cy.draw(200, 200, 300, 200)
        cy.dragSheet(20, -450)
        cy.contains('button', 'save').should('be.visible').click()
        cy.contains('button', 'exit').click()

        cy.location('pathname').should('not.contain', '/labeler/')
        cy.get('p').contains('in progress')
        cy.get('img').should('be.visible')
    })

    // TODO
    // it should navigate back to the editor
    // it should have exactly 1 path
})