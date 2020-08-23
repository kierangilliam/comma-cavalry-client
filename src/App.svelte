<script lang='ts'>
    import { Router } from '@sveltech/routify'
    import { routes } from '../.routify/routes'
    import { Theme, Stats } from '@lib/components'
    import { DEV } from '@lib/constants'
    import { onMount } from 'svelte'
    import { setup } from '@lib/capacitor'

    onMount(() => {
        setup()
    })
</script>

{#if DEV && false} <Stats /> {/if}

<Theme>
    <Router {routes} />
</Theme>