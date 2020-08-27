import type { PathType } from '@lib/types'
import type { DrawPathOpts, DrawPointsOpts } from './types'
import { getColor } from './utils'

export class ToolRenderer {
    public ctx: CanvasRenderingContext2D
    public truePathColor: boolean

    public beginPath(x: number, y: number) {
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
    }

    public drawPath(_: DrawPathOpts) {
        throw Error('Draw path is not implemented')
    }

    protected getColor(type: PathType): string {
        return getColor(type, this.truePathColor)
    }

    public drawPoints({ size, points, type }: DrawPointsOpts) {
        const color = getColor(type, this.truePathColor)

        this.ctx.strokeStyle = color
        this.ctx.fillStyle = color
        points.forEach(({ x, y }) => this.ctx.lineTo(x, y))
        this.ctx.lineWidth = size
        this.ctx.stroke()
    }
}