import { ToolRenderer } from './ToolRenderer'
import type { DrawPathOpts } from './types'

export class AutoLineRenderer extends ToolRenderer {
    public ctx: CanvasRenderingContext2D

    constructor() {
        super()
    }

    public drawPath({ points, type, size }: DrawPathOpts) {
        this.drawPoints({ size, type, points })
    }
}
