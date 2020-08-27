import { PATH_COLORS, TRUE_PATH_COLORS } from '@lib/constants'
import type { PathType } from '@lib/types'
import FloodFill from './q-floodfill'
import { ToolRenderer } from './ToolRenderer'
import type { DrawPathOpts } from './types'

export class FillRenderer extends ToolRenderer {
    public ctx: CanvasRenderingContext2D

    constructor() {
        super()
    }

    private asPalette(colors: Record<PathType, string>): string[] {
        return Object.values(colors)
    }

    public drawPath({ points, type }: DrawPathOpts) {
        const palette = this.truePathColor
            ? this.asPalette(TRUE_PATH_COLORS)
            : this.asPalette(PATH_COLORS)
        const color = this.getColor(type)
        const { x, y } = points[0]
        const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        const floodFill = new FloodFill(imageData, { palette })

        floodFill.fill(color, Math.round(x), Math.round(y), 0)
        this.ctx.putImageData(floodFill.imageData, 0, 0)
    }
}
