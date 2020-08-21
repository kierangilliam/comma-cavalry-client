import type { DrawPathOpts, DrawPointsOpts } from "./types"

export class ToolRenderer {
    public ctx: CanvasRenderingContext2D

    public beginPath(x: number, y: number) {
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
    }

    public drawPath(_: DrawPathOpts) {
        throw Error('Draw path is not implemented')
    }

    public drawPoints({ size, points, color }: DrawPointsOpts) {
        this.ctx.strokeStyle = color
        this.ctx.fillStyle = color
        points.forEach(({ x, y }) => this.ctx.lineTo(x, y))
        this.ctx.lineWidth = size
        this.ctx.stroke()
    }
}