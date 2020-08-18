<svelte:window bind:innerWidth bind:innerHeight />

<script lang='ts'>
    import { setContext, onMount, tick } from 'svelte'
    import { writable, derived } from 'svelte/store'
    import { tweened } from 'svelte/motion'
    import { cubicOut } from 'svelte/easing'
    import Hammer from 'hammerjs'

    const maxWidth = 650
    const open = writable(false)
    const positionLocked = writable(false)
    const top = tweened(0, {
		duration: 400,
		easing: cubicOut
	})

    let renderSheet = true
    let renderingSheet = false 
    let sheet: HTMLDivElement   
    let sheetStartTop: number
    let innerWidth: number
    let innerHeight: number

    // Rerender and resize sheet on window height changes
    $: rerenderSheet(innerHeight)
    $: style = sheet ? `
        max-width: ${maxWidth}px;
        top: ${renderingSheet ? '' : `${$top}px`};
        margin: ${innerWidth < maxWidth ? '0 4px' : '0 auto'};
    ` : ''
    
    setContext('bottomSheet', {         
        positionLocked,
        open: (() => {
            const { subscribe } = derived(open, ($open) => $open)

            return {
                subscribe,
                set: (value: boolean) => {
                    $open = value
                    setTopPosition()
                },
            }
        })()
    })

    onMount(async () => {
        await rerenderSheet()        
    })

    const getChildrenHeight = (): number =>
        Array.from(sheet.children).reduce((acc, curr) =>
            curr.clientHeight + acc
        , 0)

    const setTopPosition = async () => {
        // Wait for DOM to render children's height
        await tick()
        $top = $open 
            ? sheetStartTop - getChildrenHeight()
            : sheetStartTop
    }

    const rerenderSheet = async (_?) => {
        if (!sheet) return 

        renderingSheet = true
        $open = false
        
        renderSheet = false
        await tick()
        renderSheet = true
        await tick()

        console.log(sheet.getBoundingClientRect().top)

        sheetStartTop = sheet.getBoundingClientRect().top
        $top = sheetStartTop

        renderingSheet = false

        attachGestures(sheet)
    }

    const attachGestures = (sheet) => {
        const gestures = new Hammer(sheet)
        const velocityThreshold = 1.25
        const deltaThreshold = 250
        let touchStartY = 0   
        let isFirst = true
        
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

        gestures.on('panend pancancel', setTopPosition)
    }
</script>

{#if renderSheet}
    <div 
        bind:this={sheet}
        class='sheet'
        {style}
    >
        <slot />
    </div>
{/if}

<style>
    .sheet {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--background);
        border-radius: var(--borderRadius) var(--borderRadius) 0 0;
        height: auto;
        margin-left: 4px;
        margin-right: 4px;
        padding: var(--s-8) var(--s-4);;
        touch-action: none;
    }
</style>