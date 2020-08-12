<script lang='ts'>
    import * as jsfeat from 'jsfeat'
    import { onMount } from 'svelte'
    import { convertUrlToImageData } from './_test'

    const WIDTH = 600
    const HEIGHT = 400

    let image: HTMLImageElement 
    let cannyCanvas: HTMLCanvasElement
    let cannyCtx: CanvasRenderingContext2D    
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D    
    let m = { x: 300, y: 300 }
    let blurRadius = 1
    let lowThreshold = 20
    let highThreshold = 50
    let searchSpace = 250
    let cannyPoints = []

    onMount(async () => {
        const im = '0005_836d09212ac1b8fa_2018-06-15--15-57-15_23_345.png'
        const url = "https://raw.githubusercontent.com/commaai/comma10k/master/imgs/" + im 
        const result = await convertUrlToImageData(url)
        image.src = result
        cannyCtx = cannyCanvas.getContext('2d')
        ctx = canvas.getContext('2d')
    })    

	const handleMousemove = ({ clientX, clientY }) => {
        const { x, y } = cannyCanvas.getBoundingClientRect()
		m.x = clientX - x
        m.y = clientY - y
        renderLines()
	}

    function renderLines() {
        // The larger the more accurate the line detection but slower
        const size = searchSpace
        const start = {
            x: Math.floor(m.x - (size/2)),
            y: Math.floor(m.y - (size/2))
        }
        const searchRadius = 20 /* brushSize */ / 2 // get points in this radius

        let img_u8 = new jsfeat.matrix_t(size, size, jsfeat.U8C1_t)

        cannyCtx.drawImage(image, 0, 0, WIDTH, HEIGHT)
        const imageData = cannyCtx.getImageData(start.x, start.y, size, size)
        cannyCtx.clearRect(0, 0, WIDTH, HEIGHT)
        const r = blurRadius|0;
        const kernel_size = (r + 1) << 1;
        
        jsfeat.imgproc.grayscale(imageData.data, size, size, img_u8);
        jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
        jsfeat.imgproc.canny(img_u8, img_u8, lowThreshold|0, highThreshold|0);

        // render result back to canvas
        const data_u32 = new Uint32Array(imageData.data.buffer);
        const alpha = (0xff << 24);
        let i = img_u8.cols * img_u8.rows
        let pix = 0

        const debug = true
        cannyPoints = []

        while(--i >= 0) {
            pix = img_u8.data[i]
            const color = alpha | (pix << 16) | (pix << 8) | pix // -1 for white
            data_u32[i] = color

            if (color == -1) {
                const col = Math.floor(i % size)
                const row = (i - col) / size
                const x = (m.x) + (col - (size/2))
                const y = (m.y) + (row - (size/2)) 

                if (withinSearchRadius(x, y)) {   
                    debug 
                        ? cannyPoints.push({ x, y, col, row })
                        : cannyPoints.push({ x, y })
                }
            }
        }

        if (debug) {
            const debugRed = alpha | (0x00 << 16) | (0x00 << 8) | 0xff

            cannyPoints.forEach(({ col, row }) => {
                // data_u32[((x - start.x) * size) + (y - start.y)] = debugRed
                data_u32[((row) * size) + col] = debugRed
            })
        }

        cannyCtx.putImageData(imageData, start.x, start.y)

        function withinSearchRadius(x, y) {
            const dist = Math.hypot(x - m.x, y - m.y)

            return dist < searchRadius
        }
    }

    const drawCannyPoints = () => {
        if (cannyPoints.length > 0) {
            paths = [...paths, { points: cannyPoints }]
        }
    }

    let paths = []
    $: drawPaths(paths)

    const drawPaths = (_) => {
        if (!ctx) return 

        console.debug('Draw paths')

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // ctx.fillStyle = '#000000'
        // ctx.fillRect(0, 0, canvas.width, canvas.height)

        paths.forEach(({ points }) => {
            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)

            points.forEach(({ x, y }) => ctx.lineTo(x, y))

            ctx.lineWidth = 3
            ctx.strokeStyle = '#ff0000'
            ctx.fillStyle = '#ff0000'
            ctx.stroke()
            // ctx.fill()
        })
    }
</script>

<input type="range" min=0 max=10 step={0.05} bind:value={blurRadius}>
<input type="range" min=1 max=100 step={1} bind:value={lowThreshold}>
<input type="range" min=1 max=100 step={1} bind:value={highThreshold}>
<input type="range" min=1 max=100 step={1} bind:value={searchSpace}>

<br>

blur radius: {blurRadius}
low: {lowThreshold}
high: {highThreshold}
search space: {searchSpace}

<div class="inner">
    <img bind:this={image} alt="">
    <canvas 
        width={WIDTH} 
        height={HEIGHT} 
        bind:this={cannyCanvas}
    ></canvas>
    <canvas 
        bind:this={canvas}
        id='main-canvas'
        width={WIDTH} 
        height={HEIGHT} 
        on:mousemove={handleMousemove}
        on:click={drawCannyPoints}
    ></canvas>
</div>

<style>
    .inner {
        position: relative;
    }

    img, canvas {
        width: 600px;
        height: 400px;
        position: absolute;
    }

    canvas {
        /* cursor: none; */
    }
</style>