import "cypress-localstorage-commands"
import 'cypress-plugin-snapshots/commands'

describe('home - no in progress', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        cy.viewport(450, 800)
        cy.visit('localhost:5000/')
    })

    it('shows onboarding if there are no images in progress', () => {
        window.localStorage.clear()
        cy.get('p').should('not.contain', 'in progress')
    })

    it('navigates to labeler', () => {
        cy.get('button').click()
        cy.location('pathname').should('contain', '/labeler/')
    })
})

describe.only('home - with in progress', () => {
    beforeEach(() => {
        cy.clearLocalStorage()
        cy.viewport(450, 800)

        cy.visit('localhost:5000/')

    })

    const ID = '4525'
    const ID2 = '4526'

    const setSaved = () => {
        cy.setLocalStorage('saved', JSON.stringify({
            [ID]: { version: 1, paths: [] },
            [ID2]: { version: 1, paths: [{}] },
        }))

        cy.reload()
    }

    it('shows in progress', () => {
        setSaved()

        cy.get('p').contains('in progress')
        cy.get('img').should('be.visible')
        cy.wait(1000)
        // @ts-ignore
        cy.get('body').toMatchImageSnapshot({ failureThreshold: 0.05, })
    })

    it('navigates to labeler from edit', () => {
        setSaved()

        cy.get('.container').get('.item').first().click()

        cy.get('.modal').contains(`image ${ID}`)
        cy.get('canvas').should('be.visible')

        cy.get('button').contains('edit').click()
        cy.location('pathname').should('contain', '/labeler/')
    })

    it('deletes in progress', () => {
        setSaved()
        cy.reload()

        cy.getLocalStorage('saved').then((before: any) => {
            // Sanity check
            expect(JSON.parse(before)[ID].version).eq(1)

            cy.get('.container').get('.item').first().should('be.visible').click()
            cy.get('button').contains('delete').click()
            cy.get('button').contains('Yes').click()

            cy.getLocalStorage('saved').then((after: any) => {
                after = JSON.parse(after)
                expect(after[ID]).eq(undefined)
                expect(after[ID2].version).eq(1)
                expect(after[ID2].paths.length).eq(1)
            })
        })
    })
})