<script lang='ts'>
    import { Modal } from '@lib/components'
    import { paths, showGit } from './state'
    import { git } from '@lib/storage'
    import { getGithubCode, getRepos, getBranches, commitFile } from '@lib/git'
    import { H4, Button, Spacer, Flex } from '@ollopa/cedar'
    import { params } from '@sveltech/routify'
    import { getImage } from '@gql'
    import { MaskRenderer } from '@lib/mask-renderer'
    import { notifications } from '@lib/notifications'

    $: repos = (_ => {
        if (!$git) { return }
        return getRepos()
    })($git?.token)   

    $: branches = (async (_) => {
        if (!$git || !$git.repo) { return }
        return getBranches()
    })($git?.repo)

    const logout = () => {
        $git = null
        $showGit = false
    }    

    const commit = async () => {
        const message = window.prompt(
            'Commit message', `${$params.id} ${$git.username}`
        )
        const image = await getImage($params.id)
        const imageName = image.url.split('/imgs/')[1]
        let contents = await MaskRenderer.toPngBase64({
            paths: $paths,
            truePathColors: true,
        })

        contents = contents.replace('data:image/png;base64,', '')
        
        try {
            await commitFile(message, contents, imageName)
            notifications.success('Committed successfully')
        } catch (error) {
            console.error(error)
            notifications.error('Could not commit file', error)
        }
    }

    const handleRepoChange = () => {
        $git = { ...$git, branch: '' }
    }

    const triggerStateRefresh = () => {
        $git = $git
    }
</script>

<Modal bind:active={$showGit}>
    <div class='container'>    
    {#if $git?.token}
        <H4>{$git.username}</H4>

        <Spacer s={4} />

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

        <Spacer s={4} />
        
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

        <Spacer s={8} />
        
        <Flex stretch>
            <Button on:click={logout} small stretch outline warn>Logout</Button>
            <Spacer s={8} />
            <Button on:click={commit} small stretch>commit</Button>
        </Flex>
    {:else}
        <H4>github integation</H4>

        <Spacer s={4} />

        <p>Commit this image to your comma10k fork.</p>

        <Spacer s={8} />
        
        <Button on:click={getGithubCode} stretch>Login</Button>
    {/if}
    </div>
</Modal>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 0 auto;
    }

    @media screen and (min-width: 600px) {
        .container {
            width: 80%;
        }
    }

    label {
        width: 100%
    }

    select {
        display: block;
        border-radius: var(--borderRadiusSmall);
        width: 100%;
    }
</style>