import { ToolRenderer } from './ToolRenderer'
import type { DrawPathOpts } from './types'

interface DrawLineOpts {
    x: number
    y: number
    size: number
}

export class BrushRenderer extends ToolRenderer {
    public ctx: CanvasRenderingContext2D

    constructor() {
        super()
    }

    public drawPath({ points, type, size }: DrawPathOpts) {
        this.drawPoints({ size, type, points })
        this.ctx.fill()
    }

    public drawLine({ x, y, size }: DrawLineOpts) {
        this.ctx.lineTo(x, y)
        this.ctx.lineWidth = size
        this.ctx.stroke()
    }

    public finishPath() {
        this.ctx.fill()
    }
}
