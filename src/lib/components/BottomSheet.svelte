<script lang='ts'>
    import { setContext, onMount, tick } from 'svelte'
    import { writable } from 'svelte/store'
    import { tweened } from 'svelte/motion'
    import { cubicOut } from 'svelte/easing'
    import Hammer from 'hammerjs'

    const open = writable(false)
    const positionLocked = writable(false)
    const top = tweened(0, {
		duration: 400,
		easing: cubicOut
	})

    let sheet: HTMLDivElement   
    
    setContext('bottomSheet', { 
        open,
        positionLocked,
    })

    onMount(() => {
        const velocityThreshold = 1.25
        const deltaThreshold = 250
        const gestures = new Hammer(sheet)
        const sheetStartTop = sheet.getBoundingClientRect().top
        let touchStartY = 0   
        let isFirst = true
    
        $top = sheetStartTop

        gestures
            .get('pan')
            .set({ direction: Hammer.DIRECTION_ALL })        
            
        // Hammerjs isn't great at giving the correct value for 'isFirst'
        sheet.addEventListener('touchstart mousedown', () => {
            isFirst = true
        })

        gestures.on('panup pandown', ({ type, center, velocityY, deltaY }) => {
            if ($positionLocked) {
                return
            }         

            if (isFirst) {
                // touch start relative to sheet
                touchStartY = center.y - $top 
                isFirst = false
                console.debug('center.y', center.y)
            } 

            $top = center.y - touchStartY 
            
            if (
                type === 'pandown'
                && velocityY > velocityThreshold
                || deltaY > deltaThreshold
            ) {
                $open = false                
            } else if (
                type === 'panup'
                && (velocityY * -1) > velocityThreshold
                || -deltaY > deltaThreshold
            ) {
                $open = true                
            }        
        })

        gestures.on('panend pancancel', async _ => {
            // Wait for DOM to render children's height
            await tick()
            $top = $open 
                ? sheetStartTop - getChildrenHeight()
                : sheetStartTop
        })

        function getChildrenHeight(): number {
            return Array.from(sheet.children).reduce((acc, curr) =>
                curr.clientHeight + acc
            , 0)
        }
    })
</script>

<div 
    bind:this={sheet}
    class='sheet'
    style={sheet ? `top: ${$top}px;` : ''}
    class:open={$open}
>
    <slot />
</div>

<style>
    .sheet {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--background);
        border-radius: var(--borderRadius) var(--borderRadius) 0 0;
        height: auto;
        margin-left: 4px;
        margin-right: 4px;
        padding: var(--viewPadding);

        /* Needed for hammerjs */
        /* TODO Add to other hammerjs elements? */
        touch-action: none;
    }
</style>