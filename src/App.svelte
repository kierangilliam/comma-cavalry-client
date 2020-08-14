<script lang='ts'>
    import { Router } from '@sveltech/routify'
    import { routes } from '../.routify/routes'
    import { Theme } from '@lib/components'
</script>

<Theme>
    <Router {routes} />
</Theme>