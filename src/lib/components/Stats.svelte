<script>
    import { onMount, onDestroy } from "svelte"

    export let panel = 0

    let af
    let stats

    $: stats && stats.showPanel(panel)

    onMount(() => {
        const script = document.createElement('script')
        script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'
        script.onload = createStats          
        document.head.appendChild(script)
    })

    const createStats = () => {
        stats = new Stats()
        document.body.appendChild(stats.dom)

        const loop = () => { 
            stats.update()
            af = requestAnimationFrame(loop)
        }

        requestAnimationFrame(loop)
    }

    onDestroy(() => {
        document.body.removeChild(stats.dom)
        cancelAnimationFrame(af)
    })
</script>