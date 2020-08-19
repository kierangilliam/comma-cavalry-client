<script>
    import { cursor, isTouching, canvasPosition, toolMode, brushType, brushSize, zoom } from '../state'
    import { isDrawingMode, getColor } from '../utils'

    $: cursorSize = $brushSize + 5
    $: invisible = !$isTouching || !isDrawingMode($toolMode)
    $: style = $cursor && `
        background: ${getColor($brushType)};
        width: ${cursorSize}px;
        height: ${cursorSize}px;
        top: ${$cursor.windowY - (cursorSize / 2)}px;
        left: ${$cursor.windowX - (cursorSize / 2)}px;
    `
</script>

<div 
    id='cursor'
    class='bubble'
    {style}
    class:invisible
></div>

<style>
    #cursor {
        position: fixed;        
        border-radius: var(--borderRadiusFull);
        border: 2.5px solid var(--black);
        transition: opacity 150ms ease-in-out;
        cursor: none;
    }

    .invisible {
        opacity: 0;
    }
</style>