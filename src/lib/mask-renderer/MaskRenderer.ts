import { PATH_COLORS, TRUE_PATH_COLORS } from '@lib/constants'
import type { PathType } from '@lib/types'
import { AutoLineRenderer } from './AutoLineRenderer'
import { BrushRenderer } from './BrushRenderer'
import { FillRenderer } from './FillRenderer'
import type { DrawPathsOpts } from './types'
import { getColor } from './utils'

interface Tools {
    brush: BrushRenderer
    autoLine: AutoLineRenderer
    fill: FillRenderer
}

export class MaskRenderer {
    private tools: Tools
    private _ctx: CanvasRenderingContext2D

    constructor() {
        this.tools = {
            brush: new BrushRenderer(),
            autoLine: new AutoLineRenderer(),
            fill: new FillRenderer(),
        }
    }

    get ctx(): CanvasRenderingContext2D { return this._ctx }

    set ctx(ctx: CanvasRenderingContext2D) {
        this._ctx = ctx

        Object.values(this.tools).forEach(tool => {
            tool.ctx = ctx
        })
    }

    private clear(trueEmptyColor: boolean) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.fillStyle = getColor('empty', trueEmptyColor)
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }

    public drawAllPaths({
        paths, drawTruePathColors = false
    }: DrawPathsOpts) {
        this.clear(drawTruePathColors)

        this.tools.fill.palette = drawTruePathColors
            ? this.asPalette(TRUE_PATH_COLORS)
            : this.asPalette(PATH_COLORS)

        paths.forEach(({ points, size, type, mode }) => {
            const color = getColor(type, drawTruePathColors)

            this.ctx.beginPath()
            this.ctx.moveTo(points[0].x, points[0].y)

            this.ctx.lineJoin = 'round'
            this.ctx.lineCap = 'round'

            this.tools[mode].drawPath({ color, points, size, mode })
        })
    }

    public getTool<T extends keyof Tools>(tool: T): Tools[T] {
        return this.tools[tool]
    }

    private asPalette(colors: Record<PathType, string>): string[] {
        return Object.values(colors)
    }
}
