import type { Path, Point } from '@lib/types'
import { mode, standardDeviation } from '@lib/utils'
import FloodFill from 'q-floodfill'
import { getColor } from '../utils'

interface CopyImageDataOpts {
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    image: CanvasImageSource
}

interface RenderImageDataOpts {
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    canvas: HTMLCanvasElement
    imageData: ImageData
}

export const copyImageData = ({ ctx, x, y, image }: CopyImageDataOpts): ImageData => {
    ctx.drawImage(image, x, y, image.width as number, image.height as number)
    return ctx.getImageData(x, y, image.width as number, image.height as number)
}

export const renderImageData = ({ imageData, canvas, ctx, x, y }: RenderImageDataOpts) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.putImageData(imageData, x, y)
}

const getBlobFromUrl = (myImageUrl): Promise<any> => {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', myImageUrl, true);
        request.responseType = 'blob';
        request.onload = () => {
            resolve(request.response);
        };
        request.onerror = reject;
        request.send();
    })
}

const getDataFromBlob = (myBlob): Promise<any> => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(myBlob);
    })
}

export const urlToImageData = async (url: string): Promise<string> => {
    try {
        const blob = await getBlobFromUrl(url)
        return await getDataFromBlob(blob)
    } catch (err) {
        console.log(err);
        return null;
    }
}

interface DrawPathsOpts {
    ctx: CanvasRenderingContext2D,
    paths: Path[],
    renderTruePathColors?: boolean,
}

export const drawPaths = ({
    ctx, paths, renderTruePathColors = false
}: DrawPathsOpts) => {
    if (!ctx) return

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = getColor('empty', renderTruePathColors)
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // TODO
    // if (mask !== null){
    //     ctx.drawImage(mask, 0, 0)
    // }

    paths.forEach(({ points, size, type, mode }, i) => {
        const color = getColor(type, renderTruePathColors)

        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)

        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'

        if (mode === 'fill') {
            const { x, y } = points[0]
            floodFill({ ctx, x, y, color })
        } else if (mode === 'brush') {
            drawPoints({ ctx, color, points, size })
            ctx.fill()
        } else if (mode === 'autoLine') {
            drawPoints({
                ctx,
                color,
                size,
                points,
            })
        } else {
            throw Error(`Mode ${mode} not supported`)
        }
    })
}

interface DrawPointsOpts {
    ctx: CanvasRenderingContext2D
    color: string
    points: Point[]
    size: number
}

export const drawPoints = ({ ctx, size, points, color }: DrawPointsOpts) => {
    ctx.strokeStyle = color
    ctx.fillStyle = color
    points.forEach(({ x, y }) => ctx.lineTo(x, y))
    ctx.lineWidth = size
    ctx.stroke()
}

interface FloodFillOpts {
    ctx: CanvasRenderingContext2D
    color: string
    x: number
    y: number
}

export const floodFill = ({ ctx, x, y, color }: FloodFillOpts) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    const floodFill = new FloodFill(imageData)
    floodFill.fill(color, Math.round(x), Math.round(y), 10)
    ctx.putImageData(floodFill.imageData, 0, 0)
}


/**
 * AutoLine does creates excessive points. 
 * This is a hack to remove jitter in lines
 * and is a sign that there is an issue with 
 * the autoline algorithm somewhere
 */
export const collapseAutoLinePoints = (points: Point[]) => {
    const lastPoint = points[points.length - 1]
    const distX = lastPoint.x - points[0].x
    const distY = lastPoint.y - points[0].y
    const horizontal = Math.abs(distX) > Math.abs(distY)
    const leftToRight = (lastPoint.x - points[0].x) > 0
    const topToBottom = (lastPoint.y - points[0].y) > 0

    let lastValidX = points[0].x
    let lastValidY = points[0].y
    let pointsToKeep = [points[0]]

    for (let i = 1; i < points.length; i++) {
        let keep = true

        if (
            horizontal
            && ((leftToRight && points[i].x < lastValidX)
                || (!leftToRight && points[i].x > lastValidX))
        ) {
            keep = false
        }

        if (
            !horizontal
            && ((topToBottom && points[i].y < lastValidY)
                || (!topToBottom && points[i].y > lastValidY))
        ) {
            keep = false
        }

        if (keep) {
            lastValidX = points[i].x
            lastValidY = points[i].y
            pointsToKeep.push(points[i])
        }
    }

    const orthogonalPoints = points.map(({ x, y }) => horizontal ? y : x)
    const orthogonalMode = mode(orthogonalPoints)
    const orthogonalDeviation = standardDeviation(orthogonalPoints)
    const withinStdOfMode = (n: number) =>
        n + orthogonalDeviation > orthogonalMode
        && n - orthogonalDeviation < orthogonalMode

    return pointsToKeep.filter(({ x, y }) =>
        horizontal
            ? withinStdOfMode(y)
            : withinStdOfMode(x)
    )
}
