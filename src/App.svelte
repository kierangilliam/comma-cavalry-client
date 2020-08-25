<script lang='ts'>
    import { Router } from '@sveltech/routify'
    import { routes } from '../.routify/routes'
    import { Theme, Stats } from '@lib/components'
    import { DEV } from '@lib/constants'
    import { onMount } from 'svelte'
    import { setup as setupCapacitor } from '@lib/capacitor'
    import { git } from '@lib/storage'
    import { getUsername } from '@lib/git'
    import { getGithubToken } from '@lib/gql'

    onMount(async () => {
        setupCapacitor()

        const params = parseParams()
        
        if (params?.code) {
            const tokenResponse = await getGithubToken(params?.code)
            const token = `token ${tokenResponse}`
            const username = await getUsername(token)

            // Modify url in place, removing &code=...
            window.history.replaceState({}, document.title, window.location.pathname);

            $git = { ...$git, token, username, repo: 'comma10k', branch: '' }
        }
    })

    const parseParams = (): any => {
        const regex = /[?&]([^=#]+)=([^&#]*)/g
        const url = window.location.href
        let match, params = {}
        
        while (match = regex.exec(url)) {
            params[match[1]] = match[2];
        }

        return params
    }
</script>

{#if DEV && false} <Stats /> {/if}

<Theme>
    <Router {routes} />
</Theme>