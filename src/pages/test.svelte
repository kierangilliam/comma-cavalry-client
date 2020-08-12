<script lang='ts'>
    import * as jsfeat from 'jsfeat'
    import { onMount } from 'svelte'
    import { convertUrlToImageData } from './_test'

    let image: HTMLImageElement 
    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D    

    const WIDTH = 600
    const HEIGHT = 400

    let blur_radius = 1
    let low_threshold = 20
    let high_threshold = 50

    $: image?.src 
        && blur_radius 
        && low_threshold 
        && high_threshold 
        && renderLines() 

    onMount(async () => {
        const im = '0005_836d09212ac1b8fa_2018-06-15--15-57-15_23_345.png'
        const url = "https://raw.githubusercontent.com/commaai/comma10k/master/imgs/" + im 
        const result = await convertUrlToImageData(url)
        image.src = result
        ctx = canvas.getContext('2d')
    })

    let m = { x: 300, y: 300 };

	function handleMousemove(event) {
		m.x = event.clientX;
        m.y = event.clientY;
        renderLines()
	}

    function renderLines() {
        // const start = m // path.points[0] x & y
        const size = 50  // cursor x & y 
        const start = {
            x: Math.floor(m.x - (size)),
            y: Math.floor(m.y - (size))
        }
        const searchRadius = 20 /* brushSize */ / 2 // get points in this radius

        let img_u8 = new jsfeat.matrix_t(size, size, jsfeat.U8C1_t)

        ctx.drawImage(image, 0, 0, WIDTH, HEIGHT)
        const imageData = ctx.getImageData(start.x, start.y, size, size)
        const r = blur_radius|0;
        const kernel_size = (r+1) << 1;
        
        jsfeat.imgproc.grayscale(imageData.data, size, size, img_u8);
        jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
        jsfeat.imgproc.canny(img_u8, img_u8, low_threshold|0, high_threshold|0);

        // render result back to canvas
        const data_u32 = new Uint32Array(imageData.data.buffer);
        const alpha = (0xff << 24);
        let i = img_u8.cols * img_u8.rows
        let pix = 0

        let points = []

        while(--i >= 0) {
            pix = img_u8.data[i]
            //              -1 for white
            const color = alpha | (pix << 16) | (pix << 8) | pix
            data_u32[i] = color

            if (color == -1) {
                const col = Math.floor(i % size)
                const row = (i - col) / size
                points.push({ row, col })
                console.count('-1')
                console.log(i, 'row', row, 'col', col)                
            }
        }

        const debugBlue = alpha | (0xff << 16) | (0x00 << 8) | 0x00

        points.forEach(({ row, col }) => {
            data_u32[(row * size) + col] = debugBlue
            // console.log(data_u32[row*col])
            // console.count('1')
        })

        console.countReset('-1')
        console.countReset('1')

        console.log(img_u8.cols, img_u8.rows)

        ctx.putImageData(imageData, start.x, start.y)
    }

</script>

<input type="range" min=0 max=10 step={0.05} bind:value={blur_radius}>
<input type="range" min=1 max=100 step={1} bind:value={low_threshold}>
<input type="range" min=1 max=100 step={1} bind:value={high_threshold}>

<br>

blur radius: {blur_radius}
low: {low_threshold}
high: {high_threshold}

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
</style>