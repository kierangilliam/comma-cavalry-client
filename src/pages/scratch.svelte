<!-- Largely taken from https://codepen.io/njmcode/pen/BNLKbK?editors=1010 -->

<script>
    import { onMount } from "svelte"
    import { IMAGE_WIDTH, IMAGE_HEIGHT } from "@lib/constants"

    (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

    // 1 is max resolution
    export let resolution = 1
    export let scale = .25
    export let drift = 30
    
    const scaledHeight = IMAGE_HEIGHT * scale
    const scaledWidth = IMAGE_WIDTH * scale
    const CW = IMAGE_WIDTH * resolution
    const CH = IMAGE_HEIGHT * resolution
    const DRIFT_RANGE = drift * resolution

    // TODO Canvas element that loads the content in its slot after mounting
    // setContext  (canvas, ctx)

    let loaded = 0
    $: loaded === 2 && (init())    

    let sourceData, 
        depthData,
        outputData,
        cOutput,
        ctxOutput,    
        images

    let style = `
        width: ${scaledWidth}px;
        height: ${scaledHeight}px;
    `

    let cursor

    // Faster than Math.round 
    // https://stackoverflow.com/questions/8483357/why-is-math-round-in-javascript-slower-than-a-custom-built-function
    function round(a) {
        var c = a % 1;
        return a - c + (c / 1 + 1.5 >> 1) * 1
    }

    const setCursor = ({ clientX, clientY }) => {
        cursor = {
            x: clientX,
            y: clientY,
        }
    }

    onMount(() => {
        // Create/cache canvases and contexts for source image, 
        // displacement map, and output
        cOutput = document.getElementById('output')
        ctxOutput = cOutput.getContext('2d')

        images = document.querySelectorAll('#images img')

        // Refs for the image data
        outputData = ctxOutput.createImageData(CW, CH);
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

        // Iterate the xy grid
        // TODO: optimize this!
        for (let y = 0; y < CH; y++) {
            for (let x = 0; x < CW; x++) {
                // Get the greyscale value from the displacement map as a value between 0 and 1
                // 0 = black (closest), 1 = white (farthest)
                // Higher values will be more displaced
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
                if (ofs_y > CH - 1) ofs_y = CH - 1

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

    function render() {
        ctxOutput.putImageData(outputData, 0, 0)
    }

    function loop() {
        update()
        render()
        requestAnimationFrame(loop)
    }

    function init() {
        // Write our source image and displacement map to in-memory
        // canvases and cache the data (it never gets directly manipulated)
        let cSource = document.createElement('canvas')
        let ctxSource = cSource.getContext('2d')

        let cMap = document.createElement('canvas')
        let ctxMap = cMap.getContext('2d')

        // Ensure all canvases are the same size
        cSource.width = cMap.width = cOutput.width = CW
        cSource.height = cMap.height = cOutput.height = CH

        let sourceImg = images[0]
        let mapImg = images[1]

        ctxSource.drawImage(sourceImg, 0, 0, CW, CH);
        sourceData = ctxSource.getImageData(0, 0, CW, CH).data;

        ctxMap.drawImage(mapImg, 0, 0, CW, CH);
        let mapData = ctxMap.getImageData(0, 0, CW, CH).data;

        depthData = []

        for (let y = 0; y < CH; y++) {
            for (let x = 0; x < CW; x++) {
                let pix = y * CW + x
                let arrayPos = pix * 4
                depthData.push(1 - (mapData[arrayPos] / 255))
            }
        }
        
        cMap, ctxMap, mapData, cSource = null

        loop()
    }
</script>

<canvas 
    on:mousemove={e => setCursor(e)}
    on:touchmove={({ touches }) => setCursor(touches[0])}
    on:touchend={() => cursor = null}
    on:mouseout={() => cursor = null}
    {style} 
    id="output"
></canvas>

<div id="images">
    <img 
        on:load={() => loaded++}
        id="source" 
        {style}
        alt=''
        src="https://raw.githubusercontent.com/commaai/comma10k/master/imgs/0260_e61068239ce72500_2018-07-31--22-35-41_1_1008.png" 
        crossorigin="anonymous" 
    />
    <img 
        on:load={() => loaded++}
        {style}
        id="map" 
        alt=''
        src="https://ik.imagekit.io/ollopa/0260_e61068239ce72500_2018-07-31--22-35-41_1_1008_Cq9e6Ou8dj.jpg" 
        crossorigin="anonymous" 
    />
</div>