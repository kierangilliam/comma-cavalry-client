<script lang='ts'>
    import { PATH_COLORS, COLOR_SHORTCUTS } from '@lib/constants'
    import type { PathType, ToolMode } from '@lib/types'
    import { Haptics, isDesktop } from '@lib/capacitor'
    import { brushType, toolMode } from '../state'
    import { Spacer } from '@ollopa/cedar'
    import { setMode } from '../utils'

    export let showLabels: boolean = false

    if (isDesktop) {
        window.addEventListener('keyup', ({ keyCode }: KeyboardEvent) => {
            if (COLOR_SHORTCUTS[keyCode]) {
                $brushType = COLOR_SHORTCUTS[keyCode]
            }
        })
    }

    const updateTool = (_ => {
        let lastType = $brushType
        let drawingTools: ToolMode[] = ['brush', 'fill', 'autoLine']

        return (type: string) => {
            Haptics.select()

            if ($toolMode === 'move') {
                setMode('last')
            } else if (lastType === type) {
                // Cycle through to the next mode
                let i = drawingTools.indexOf($toolMode)
                let newMode = drawingTools[(i + 1) % drawingTools.length]

                setMode(newMode)
            }
            
            lastType = (type as PathType)
            $brushType = (type as PathType)            
        }
    })()
</script>
            
<div class='color-row'>
    {#each Object.entries(PATH_COLORS) as [id, color]}
        <div 
            class='item'            
            on:click={() => updateTool(id)}
        >
            <div 
                class='bubble' 
                class:selected={$brushType === id}
                style='background: {color}'
            ></div>

            {#if showLabels}
                <Spacer s={2} />
                <label for=''>
                    {id === 'lane markings' ? 'lanes' : id }
                </label>
            {/if}
        </div>
    {/each}
</div>

<style>
    .color-row {
        display: flex;
        justify-content: space-between;
    }

    .item {
        --bubbleSize: 32px;
        --bubbleInnerShadow: inset -3px -3px 0px rgba(0, 0, 0, 0.12);

        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .bubble {
        width: var(--bubbleSize);
        height: var(--bubbleSize);
        border: none;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 
            var(--bubbleInnerShadow);
        transition: all 150ms ease-out;
    }

    .selected {
        --whiteSelectionBorder: 0px 0px 0px 2px var(--white);
        
        border: 3px solid var(--background);
        box-shadow: var(--bubbleInnerShadow),
            var(--whiteSelectionBorder);
    }
</style>