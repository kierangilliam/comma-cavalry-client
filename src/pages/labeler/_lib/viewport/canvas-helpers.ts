interface CopyImageDataOpts {
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    size: number
    image: CanvasImageSource
}

interface RenderImageDataOpts {
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    canvas: HTMLCanvasElement
    imageData: ImageData
}

export const copyImageData = ({ ctx, x, y, image, size }: CopyImageDataOpts): ImageData => {
    ctx.drawImage(image, x, y, size, size)
    return ctx.getImageData(x, y, size, size)
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
