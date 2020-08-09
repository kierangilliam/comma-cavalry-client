<script lang='ts'>
    import { Router } from '@sveltech/routify'
    import { routes } from '../.routify/routes'
</script>

<style>
    :global(body) {
        margin: 0;
    }
</style>

<!-- <style global>
    @import '../static/global.css';
</style> -->

<Router {routes} />