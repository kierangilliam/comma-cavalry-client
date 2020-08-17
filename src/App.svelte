<script lang='ts'>
    import { Router } from '@sveltech/routify'
    import { routes } from '../.routify/routes'
    import { Theme, Stats } from '@lib/components'
    import { DEV } from '@lib/constants'
</script>

{#if DEV}
    <Stats />
{/if}

<Theme>
    <Router {routes} />
</Theme>