import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@lib/constants'
import { AutoLineRenderer } from './AutoLineRenderer'
import { BrushRenderer } from './BrushRenderer'
import { FillRenderer } from './FillRenderer'
import type { ToolRenderer } from './ToolRenderer'
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
    private _truePathColor: boolean

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
        this._ctx.imageSmoothingEnabled = false

        Object.values(this.tools).forEach(tool => {
            tool.ctx = ctx
        })
    }

    get truePathColor(): boolean { return this._truePathColor }

    set truePathColor(truePathColor: boolean) {
        this._truePathColor = truePathColor

        Object.values(this.tools).forEach((tool: ToolRenderer) => {
            tool.truePathColor = truePathColor
        })
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.fillStyle = getColor('empty', this.truePathColor)
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }

    public drawAllPaths({ paths, mask = null }: DrawPathsOpts) {
        if (mask) {
            const { width, height } = this.ctx.canvas
            this.ctx.clearRect(0, 0, width, height)
            this.ctx.putImageData(mask, 0, 0, 0, 0, width, height)
        } else {
            this.clear()
        }

        paths.forEach(({ points, size, type, mode }) => {
            this.ctx.beginPath()
            this.ctx.moveTo(points[0].x, points[0].y)

            this.ctx.lineJoin = 'round'
            this.ctx.lineCap = 'round'

            this.tools[mode].drawPath({ type, points, size, mode })
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

}
