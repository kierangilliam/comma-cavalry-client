<script context='module'>
    let zIndex = 1
</script>

<script lang='ts'>
    import { fly } from 'svelte/transition'
    import { quintOut } from 'svelte/easing'
    import { H4, Spacer } from '@ollopa/cedar'
    import { onMount, createEventDispatcher } from 'svelte'

    export let timeout: number = 7500
    export let title: string
    export let body: string
    export let color: string = 'var(--background)'
    export let textColor: string = 'var(--white)'

    const ANIMATION_DURATION = 250
    const dispatch = createEventDispatcher()
    const style = `
        color: ${textColor};
        background: ${color};
        z-index: ${zIndex * 100};
    `

    let active = true

    onMount(() => {
        zIndex += 1

        setTimeout(() => {
            active = false
            
            // Wait until animation finishes to dispatch
            setTimeout(() => dispatch('inactive') , ANIMATION_DURATION)
        }, timeout + ANIMATION_DURATION)
    })
</script>

{#if active}
    <div 
        class='notification'
        {style}
        transition:fly={{ 
            y: -50, 
            easing: quintOut, 
            duration: ANIMATION_DURATION,
        }}
    >
        <H4>{title}</H4>
        <Spacer s={2} />
        <p>{body}</p>
    </div>
{/if}

<style>
    .notification { 
        position: absolute;
        top: calc(env(safe-area-inset-top) + 16px);
        left: calc(env(safe-area-inset-left) + 16px);;     
        right: calc(env(safe-area-inset-right) + 16px);;  
        pointer-events: none; 

        border-radius: 16px;
        box-shadow: var(--modalShadow);
        padding: var(--s-4) var(--s-8);
    }
</style>