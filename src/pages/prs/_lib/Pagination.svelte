<script lang='ts'>
    import { Flex } from '@ollopa/cedar'
    import type { PullRequest } from '@lib/types'
    import { clamp } from '@lib/utils'
    import { isDesktop } from '@lib/capacitor'

    export let pr: PullRequest
    export let index: number

    const inc = () => index = clamp(index + 1, 0, pr.files.length - 1)
    const dec = () => index = clamp(index - 1, 0, pr.files.length - 1)

    if (isDesktop) {
        document.addEventListener('keyup', ({ key }) => {
            if (key === 'ArrowRight') inc() 
            else if (key === 'ArrowLeft') dec()
        })
    }
</script>

<div>
    <span>
        PR {pr.number} ({index + 1} of {pr.files.length})
    </span>
    <Flex justify='between'>
        <span class='link' on:click={dec}>prev</span>
        <span class='link' on:click={inc}>next</span>
    </Flex>
</div>

<style>
    div {
        position: absolute;
        border-radius: var(--borderRadiusSmall);
        background: var(--black);
        padding: var(--s-2) var(--s-3);
        top: calc(env(safe-area-inset-top) + 16px);     
        left: calc(env(safe-area-inset-left) + 16px);     
    }

    .link {
        font-weight: bolder;
        color: var(--primary);
    }
    .link:hover {
         cursor: pointer;
    }
</style>