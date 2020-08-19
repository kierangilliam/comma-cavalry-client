
declare namespace Cypress {
    interface Chainable {
        dragSheet(yStart: number, yDiff: number): Chainable<Element>
        draw(xStart: number, yStart: number, x: number, y: number): Chainable<Element>
        fill(x: number, y: number): Chainable<Element>
        toMatchImageSnapshot(): Chainable<Element>
    }
}