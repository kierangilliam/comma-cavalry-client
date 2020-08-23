import FloodFill from './q-floodfill'
import { ToolRenderer } from './ToolRenderer'
import type { DrawPathOpts } from './types'

export class FillRenderer extends ToolRenderer {
    public ctx: CanvasRenderingContext2D
    public palette: string[]

    constructor() {
        super()
    }

    public drawPath({ points, color }: DrawPathOpts) {
        const { x, y } = points[0]
        const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        const floodFill = new FloodFill(imageData, { palette: this.palette })

        floodFill.fill(color, Math.round(x), Math.round(y), 0)
        this.ctx.putImageData(floodFill.imageData, 0, 0)
    }
}
