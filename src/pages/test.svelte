<script lang='ts'>
    import * as jsfeat from 'jsfeat'
    import { onMount } from 'svelte'
    import { convertUrlToImageData } from './_test'

    const WIDTH = 600
    const HEIGHT = 400

    let image: HTMLImageElement 
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D    
    let m = { x: 300, y: 300 }
    let blurRadius = 1
    let lowThreshold = 20
    let highThreshold = 50
    let searchSpace = 350

    onMount(async () => {
        const im = '0005_836d09212ac1b8fa_2018-06-15--15-57-15_23_345.png'
        const url = "https://raw.githubusercontent.com/commaai/comma10k/master/imgs/" + im 
        const result = await convertUrlToImageData(url)
        image.src = result
        ctx = canvas.getContext('2d')
    })    

	const handleMousemove = ({ clientX, clientY }) => {
        const { x, y } = canvas.getBoundingClientRect()
		m.x = clientX - x
        m.y = clientY - y
        renderLines()
	}

    function renderLines() {
        // The larger the more accurate the line detection but slower
        const size = 350
        const start = {
            x: Math.floor(m.x - (size/2)),
            y: Math.floor(m.y - (size/2))
        }
        const searchRadius = 20 /* brushSize */ / 2 // get points in this radius

        let img_u8 = new jsfeat.matrix_t(size, size, jsfeat.U8C1_t)

        ctx.drawImage(image, 0, 0, WIDTH, HEIGHT)
        const imageData = ctx.getImageData(start.x, start.y, size, size)
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

        let points = []

        while(--i >= 0) {
            pix = img_u8.data[i]
            const color = alpha | (pix << 16) | (pix << 8) | pix // -1 for white
            data_u32[i] = color

            if (color == -1) {
                const y = Math.floor(i % size)
                const x = (i - y) / size
                if (withinSearchRadius(x, y)) {   
                    points.push({ x, y })
                }
            }
        }

        const debugRed = alpha | (0x00 << 16) | (0x00 << 8) | 0xff

        points.forEach(({ x, y }) => {
            data_u32[(x * size) + y] = debugRed
        })

        function withinSearchRadius(x, y) {
            const absoluteX = start.x + x
            const absoluteY = start.y + y

            return m.x < absoluteX + searchRadius
                && m.x > absoluteX - searchRadius
                && m.y < absoluteY + searchRadius
                && m.y > absoluteY - searchRadius
        }

        ctx.putImageData(imageData, start.x, start.y)
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

<canvas 
    width={WIDTH} height={HEIGHT} bind:this={canvas}
    on:mousemove={handleMousemove}
></canvas>
<img bind:this={image} alt="">

<style>
    img, canvas {
        width: 600px;
        height: 400px;
    }

    canvas {
        cursor: none;
    }
</style>