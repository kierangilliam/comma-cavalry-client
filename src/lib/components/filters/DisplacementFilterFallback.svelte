<!-- 
    Largely taken from https://codepen.io/njmcode/pen/BNLKbK?editors=1010 
    But ended up being way to slow so this could be a fallback if webgl isn't enabled
-->

<script>
    import { onMount, onDestroy } from 'svelte'
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from '@lib/constants'    
    import { clamp } from '@lib/utils'
    
    export let resolution = .25
    export let scale = .25
    export let drift = 30
    export let source = 'https://raw.githubusercontent.com/commaai/comma10k/master/imgs/0260_e61068239ce72500_2018-07-31--22-35-41_1_1008.png' 
    export let map = 'https://ik.imagekit.io/ollopa/0260_e61068239ce72500_2018-07-31--22-35-41_1_1008_Cq9e6Ou8dj.jpg' 
    
    // 1 is max resolution and scale
    const RESOLUTION = clamp(resolution, 0, 1)
    const CW = IMAGE_WIDTH * RESOLUTION
    const CH = IMAGE_HEIGHT * RESOLUTION
    const DRIFT_RANGE = drift * RESOLUTION    

    let sourceData
    let depthData
    let outputData
    let ctxOutput
    let cursor
    let target
    let af

    $: scaledHeight = IMAGE_HEIGHT * scale
    $: scaledWidth = IMAGE_WIDTH * scale
    $: style = `
        width: ${scaledWidth}px;
        height: ${scaledHeight}px;
    `

    onMount(() => {
        const sourceImage = new Image()
        const mapImage = new Image()
        const initWaiter = ((expected) => {
            let loaded = 0

            // Wait until both images are loaded
            return () => {
                loaded++
                if (loaded == expected) init(sourceImage, mapImage)
            }
        })(2)

        sourceImage.crossOrigin = mapImage.crossOrigin = 'anonymous'
        sourceImage.src = source 
        mapImage.src = map         
        
        sourceImage.onload = initWaiter
        mapImage.onload = initWaiter                
    })

    onDestroy(() => {
        cancelAnimationFrame(af)
    })

    function update() {
        // Calculate the xy drift based on the current time.
        // y drift is half-speed
        // TODO: make interactive (mouse, gyro, etc)
        let t = 0.002 * Date.now(),
            dx = Math.sin(t) * DRIFT_RANGE,
            dy = Math.cos(t * 0.5) * DRIFT_RANGE;

        if (cursor) {
            const percentX = cursor.x / scaledWidth
            const percentY = cursor.y / scaledHeight
            dx = (percentX - .5) * (DRIFT_RANGE * 2) * -1
            dy = (percentY - .5) * (DRIFT_RANGE * 2) * -1
        }

        // TODO: optimize this!
        for (let y = 0; y < CH; y++) {
            for (let x = 0; x < CW; x++) {                
                const pix = y * CW + x
                const arrayPos = pix * 4
                const depth = depthData[pix]

                // Use the greyscale value as a percentage of our current drift,
                // and calculate an xy pixel offset based on that
                let ofs_x = Math.round(x + (dx * depth))
                let ofs_y = Math.round(y + (dy * depth))

                // Clamp the offset to the canvas dimensions
                if (ofs_x < 0) ofs_x = 0
                if (ofs_x > CW - 1) ofs_x = CW - 1
                if (ofs_y < 0) ofs_y = 0
                if (ofs_y > CH - DRIFT_RANGE) ofs_y = CH - DRIFT_RANGE + y

                // Get the color from the source image at the offset xy position,
                // and transfer it to our output at the original xy position
                const targetPix = ofs_y * CW + ofs_x
                const targetPos = targetPix * 4

                outputData.data[arrayPos] = sourceData[targetPos]
                outputData.data[arrayPos + 1] = sourceData[targetPos + 1]
                outputData.data[arrayPos + 2] = sourceData[targetPos + 2]
                outputData.data[arrayPos + 3] = sourceData[targetPos + 3]
            }
        }
    }

    function loop() {
        update()
        // Render
        ctxOutput.putImageData(outputData, 0, 0)
        af = requestAnimationFrame(loop)
    }

    function init(sourceImg, mapImg) {
        // Create/cache canvases and contexts for source image, 
        // displacement map, and output
        ctxOutput = target.getContext('2d')

        // Refs for the image data
        outputData = ctxOutput.createImageData(CW, CH);

        // Write our source image and displacement map to in-memory
        // canvases and cache the data (it never gets directly manipulated)
        let cSource = document.createElement('canvas')
        let ctxSource = cSource.getContext('2d')
        let cMap = document.createElement('canvas')
        let ctxMap = cMap.getContext('2d')

        // Ensure all canvases are the same size
        cSource.width = cMap.width = target.width = CW
        cSource.height = cMap.height = target.height = CH

        ctxSource.drawImage(sourceImg, 0, 0, CW, CH)
        ctxMap.drawImage(mapImg, 0, 0, CW, CH)
        
        sourceData = ctxSource.getImageData(0, 0, CW, CH).data
        let mapData = ctxMap.getImageData(0, 0, CW, CH).data

        depthData = []

        for (let y = 0; y < CH; y++) {
            for (let x = 0; x < CW; x++) {
                let pix = y * CW + x
                let arrayPos = pix * 4
                // Get the greyscale value from the displacement map as a value between 0 and 1
                // 0 = black (closest), 1 = white (farthest)
                // Lower values will be more displaced
                depthData.push(1 - (mapData[arrayPos] / 255))
            }
        }
        
        cMap, ctxMap, mapData, cSource = null

        af = requestAnimationFrame(loop)
    }

    const setCursor = (e) => {
        cursor = e 
            ? { x: e.clientX, y: e.clientY }
            : null
    }
</script>

<canvas 
    bind:this={target}
    {style} 
    on:mousemove={e => setCursor(e)}
    on:touchmove={({ touches }) => setCursor(touches[0])}
    on:touchend={() => setCursor(null)}
    on:mouseout={() => setCursor(null)}
></canvas>
