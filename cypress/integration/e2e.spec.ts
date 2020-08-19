import 'cypress-localstorage-commands'
import 'cypress-plugin-snapshots/commands'

describe('simple', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        cy.viewport(400, 850)
        cy.visit('localhost:5000/')
    })

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
})

describe('complex', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        cy.viewport(400, 850)
        cy.visit('localhost:5000/labeler/4525')

        cy.setLocalStorage('showEditorTutorial', JSON.stringify(false))
        cy.reload()

        cy.get('.sheet').should('be.visible')

        cy.draw(100, 300, 200, 400)
        cy.draw(200, 400, 300, 500)

        cy.get('.color-row').get('.item').last().click()
        cy.get('#status-indicator').contains('movable').contains('brush')
        cy.get('.color-row').get('.item').last().click() // Cycle through
        cy.get('#status-indicator').contains('movable').contains('fill')

        cy.fill(20, 450)

        cy.dragSheet(20, -450)
        cy.get('button').contains('save').click()
        cy.get('button').contains('exit').click()
    })

    it('should have the correct local storage', () => {
        cy.getLocalStorage('saved').then(_saved => {
            const saved = JSON.parse(_saved || '')
            const [path1, path2, path3] = saved['4525'].paths

            expect(path1).to.deep.equal({
                mode: 'brush',
                size: 10,
                points: [
                    { x: 291, y: -151.77924258372926 },
                    { x: 582, y: 139.22075741627077 },
                ],
                type: 'road',
            })

            expect(path2).to.deep.equal({
                mode: 'brush',
                size: 10,
                points: [
                    { x: 582, y: 139.22075741627077 },
                    { x: 873, y: 430.22075741627077 },
                ],
                type: 'road',
            })

            expect(path3).to.deep.equal({
                mode: 'fill',
                points: [{ x: 58.2, y: 497.74995849609377 }],
                type: 'movable',
                size: 10,
            })

            cy.get('.container').get('.item').click()
            cy.get('button').contains('edit').click()
            cy.wait(1500)
            cy.get('#viewport-canvas').toMatchImageSnapshot()
        })
    })

    it('should be able to submit an image', () => {
        cy.get('.container').get('.item').click()
        cy.get('button').contains('email me').click()
        cy.get('input').first().type('Kieran Gill')
        cy.get('input').last().type('Kieran.Gill15@gmail.com')
            .should('have.value', 'Kieran.Gill15@gmail.com')
        cy.get('.modal').last().click() // unfocus input
        cy.get('button[type=submit]').click()
        cy.wait(3000)
        cy.get('.notification')
            .should('be.visible')
            .contains('Success')
            .contains('Your mask was sent to your email')
    })
})