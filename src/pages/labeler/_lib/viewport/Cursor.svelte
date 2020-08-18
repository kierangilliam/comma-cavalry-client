<script>
    import { cursor, isTouching, canvasPosition, toolMode, brushType, brushSize } from '../state'
    import { isDrawingMode, getColor } from '../utils'

    $: cursorSize = $brushSize + 5;
    $: invisible = !$isTouching || !isDrawingMode($toolMode)
    $: style = $cursor && `
        background: ${getColor($brushType)};
        width: ${cursorSize}px;
        height: ${cursorSize}px;
        top: ${$canvasPosition.y + $cursor.y - (cursorSize / 2)}px;
        left: ${$canvasPosition.x + $cursor.x - (cursorSize / 2)}px;
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
    }

    .invisible {
        opacity: 0;
    }
</style>