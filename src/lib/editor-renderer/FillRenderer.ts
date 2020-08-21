import FloodFill from 'q-floodfill'
import { ToolRenderer } from './ToolRenderer'
import type { DrawPathOpts } from './types'

export class FillRenderer extends ToolRenderer {
    public ctx: CanvasRenderingContext2D

    constructor(private fillTolerance: number) {
        super()
    }

    public drawPath({ points, color }: DrawPathOpts) {
        const { x, y } = points[0]
        const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        const floodFill = new FloodFill(imageData)

        floodFill.fill(color, Math.round(x), Math.round(y), this.fillTolerance)
        this.ctx.putImageData(floodFill.imageData, 0, 0)
    }
}
