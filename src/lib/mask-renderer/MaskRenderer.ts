import { IMAGE_HEIGHT, IMAGE_WIDTH, PATH_COLORS, TRUE_PATH_COLORS } from '@lib/constants'
import type { PathType } from '@lib/types'
import { AutoLineRenderer } from './AutoLineRenderer'
import { BrushRenderer } from './BrushRenderer'
import { FillRenderer } from './FillRenderer'
import type { DrawPathsOpts, ToPngOpts } from './types'
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

    public drawAllPaths({ paths, truePathColors = false }: DrawPathsOpts) {
        this.clear(truePathColors)

        this.tools.fill.palette = truePathColors
            ? this.asPalette(TRUE_PATH_COLORS)
            : this.asPalette(PATH_COLORS)

        paths.forEach(({ points, size, type, mode }) => {
            const color = getColor(type, truePathColors)

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

    public static async toPngBlob({ paths, truePathColors = false }: ToPngOpts): Promise<Blob> {
        const dataUrl = await this.toPngBase64({ paths, truePathColors })
        const result = await fetch(dataUrl)

        return result.blob()
    }

    public static async toPngBase64({ paths, truePathColors = false }: ToPngOpts): Promise<string> {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const renderer = new MaskRenderer()

        renderer.ctx = ctx
        canvas.width = IMAGE_WIDTH
        canvas.height = IMAGE_HEIGHT
        renderer.drawAllPaths({ paths, truePathColors })

        return canvas.toDataURL('image/png')
    }

    private asPalette(colors: Record<PathType, string>): string[] {
        return Object.values(colors)
    }
}
