<script>
    import { onMount } from "svelte"

    onMount(() => {
        const script = document.createElement('script')
        script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'
        script.onload = createStats          
        document.head.appendChild(script)
    })

    const createStats = () => {
        const stats = new Stats()
        document.body.appendChild(stats.dom)

        const loop = () => { 
            stats.update()
            requestAnimationFrame(loop)
        }

        requestAnimationFrame(loop)
    }
</script>