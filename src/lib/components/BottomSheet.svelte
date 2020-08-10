<script lang='ts'>
    import { setContext, onMount } from 'svelte'
    import { writable } from 'svelte/store'
    import { tweened } from 'svelte/motion'
    import { cubicOut } from 'svelte/easing'
    import Hammer from 'hammerjs'

    const open = writable(false)

    setContext('open', { open })
    
    const top = tweened(0, {
		duration: 400,
		easing: cubicOut
	})

    let sheet: HTMLDivElement       

    onMount(() => {
        const velocityThreshold = 1.25
        const deltaThreshold = 250
        const gestures = new Hammer(sheet)
        const sheetStartTop = sheet.getBoundingClientRect().top
        let touchStartY = 0   
    
        $top = sheetStartTop

        gestures
            .get('pan')
            .set({ direction: Hammer.DIRECTION_ALL })

        gestures.on('panup pandown', ({ velocityY, isFirst, center, deltaY }) => {
            if (
                velocityY > 0 && velocityY > velocityThreshold
                || deltaY > deltaThreshold
            ) {
                $open = false                
            } else if (
                velocityY < 0 && (velocityY * -1) > velocityThreshold
                || -deltaY > deltaThreshold
            ) {
                $open = true                
            }        

            if (isFirst) {
                touchStartY = center.y - $top 
            } else {
                const deltaY = touchStartY - center.y
                
                $top = deltaY * -1
            }
        })

        sheet.addEventListener('touchend', () => {
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
    }
</style>