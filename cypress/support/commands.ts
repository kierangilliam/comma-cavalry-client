Cypress.Commands.add('draw', (xStart: number, yStart: number, x: number, y: number) => {
    const e = {
        force: true,
        pointerType: 'touch',
    }

    cy.get('#editor-gesture-target')
        .wait(150)
        .trigger('pointerdown', x, y, e)
        .wait(150)
        .trigger('pointermove', xStart, yStart, e)
        .wait(150)
        .trigger('pointermove', x, y, e)
        .wait(150)
        .trigger('pointerup', x, y, e)
        .wait(150)
})

Cypress.Commands.add('fill', (x: number, y: number) => {
    const e = {
        force: true,
        pointerType: 'touch',
    }

    cy.get('#editor-gesture-target')
        .wait(150)
        .trigger('pointerdown', x, y, e)
        .wait(150)
        .trigger('pointerup', x, y, e)
        .wait(150)
})

Cypress.Commands.add('dragSheet', (yStart: number, yDiff: number) => {
    const x = 200
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
})
