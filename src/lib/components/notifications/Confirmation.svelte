<script>
    import { createEventDispatcher } from 'svelte'
    import { H4, Flex, Button, Spacer } from '@ollopa/cedar'
    import Modal from '../Modal.svelte'

    export let question = ''

    let active = true

    const dispatch = createEventDispatcher()    

    const dispatcher = (event) => () => {
        dispatch(event)
        active = false
    }    
</script>

<Modal 
    {active} 
    closable={false}
>
    <H4>{question}</H4>   

    <Spacer s={8} />

    <Flex>
        <Button on:click={dispatcher('denied')} outline stretch>
            No
        </Button>
        <Spacer s={8} />
        <Button on:click={dispatcher('confirmed')} stretch>
            Yes
        </Button>
    </Flex>
</Modal>