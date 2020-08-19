import type { Path, Point } from "@lib/types"
import FloodFill from 'q-floodfill'
import { getColor } from "../utils"

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

        if (mode === 'fill') {
            const { x, y } = points[0]
            floodFill({ ctx, x, y, color })
        } else {
            drawPoints({ ctx, color, points, size })
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
    ctx.fill()
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
