<script lang='ts'>
    import Modal from '../Modal.svelte'    
    import Carousel from '../Carousel.svelte'    
    import TutorialSection from './TutorialSection.svelte'    
        
    export let active: boolean = false
    export let tutorials: { title: string, body: string }[]

    const sections = tutorials.map(({ title, body }) => ({
        component: TutorialSection as SvelteComponent,
        props: { title, body },
    }))
</script>

<Modal bind:active padding={{ x: '0' }}>
    <Carousel {sections} />
</Modal>
