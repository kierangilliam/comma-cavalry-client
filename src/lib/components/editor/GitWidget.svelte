<script lang='ts'>
    import { git } from '@lib/storage'
    import { getGithubCode, getRepos, getBranches, commitFile } from '@lib/git'
    import { H4, Button, Spacer, Flex } from '@ollopa/cedar'
    import { getImage } from '@gql'
    import { MaskRenderer } from '@lib/mask-renderer'
    import { notifications } from '@lib/notifications'
    import type { Path } from '@lib/types'

    export let id: string
    export let paths: Path[]
    export let active: boolean = false

    $: repos = (_ => {
        if (!$git) { return }
        return getRepos()
    })($git?.token)   

    $: branches = (async (_) => {
        if (!$git || !$git.repo) { return }
        return getBranches()
    })($git?.repo)

    let loading = false

    const logout = () => {
        $git = null
        active = false
    }    

    const commit = async () => {
        loading = true 

        const message = window.prompt(
            'Commit message', `${id} ${$git.username}`
        )        
        
        try {
            const image = await getImage(id)
            const imageName = image.url.split('/imgs/')[1]
            let contents = await MaskRenderer.toPngBase64({
                paths,
                truePathColors: true,
            })

            contents = contents.replace('data:image/png;base64,', '')
            await commitFile(message, contents, imageName)
            notifications.success('Committed successfully')
        } catch (error) {
            console.error(error)
            notifications.error('Could not commit file', error)
        } finally {
            loading = false
        }
    }

    const handleRepoChange = () => {
        $git = { ...$git, branch: '' }
    }

    const triggerStateRefresh = () => {
        $git = $git
    }
</script>


<div class='container'>    
    {#if $git && $git.token}
        <H4>{$git.username}</H4>

        <Spacer />

        {#await repos}
            Loading...
        {:then repos}
            <label for='repo'>Repository</label>
            <select 
                name='repo' 
                class='form-field' 
                bind:value={$git.repo} 
                on:blur={handleRepoChange} 
            >
                {#each repos as { name }}
                    <option selected={$git.repo === name} value={name}>
                        {name}
                    </option>
                {:else}
                    Could not find any public repos
                {/each}
            </select>
        {:catch error}
            Error fetching details {error}
        {/await}        

        <Spacer />
        
        {#await branches}
            Loading...
        {:then branches}
            <label for='branch'>Branch</label>
            <select 
                name='branch' 
                class='form-field' 
                bind:value={$git.branch} 
                on:blur={triggerStateRefresh} 
            >
                <option selected={!$git.branch} value=''></option>
                {#each branches as { name }}
                    <option selected={$git.branch === name} value={name}>
                        {name}
                    </option>
                {/each}
            </select>
        {:catch error}
            Error fetching details {error}
        {/await}        

        <Spacer />
        
        <Flex stretch>
            <Button on:click={logout} disabled={loading} small stretch outline warn>Logout</Button>
            <Spacer s={8} />
            <Button on:click={commit} disabled={loading} small stretch>commit</Button>
        </Flex>
    {:else}
        <H4>github</H4>

        <Spacer />

        <p>Login to commit this image to your comma10k fork.</p>

        <Spacer />
        
        <Button on:click={getGithubCode} stretch>Login</Button>
    {/if}
</div>

<style>
    .container {
        padding: var(--s-4) var(--s-4);
    }

    select {
        display: block;
        border-radius: var(--borderRadiusSmall);
        width: 100%;
    }
</style>