<script lang='ts'>
    import { Router } from '@sveltech/routify'
    import { routes } from '../.routify/routes'
    import { Theme } from '@lib/components'
</script>

<style>
    :global(body) {
        margin: 0;
    }
</style>

<!-- <style global>
    @import '../static/global.css';
</style> -->

<Theme>
    <Router {routes} />
</Theme>