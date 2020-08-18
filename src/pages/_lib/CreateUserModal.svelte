<script lang='ts'>
    import { createEventDispatcher, onMount, onDestroy } from 'svelte'
    import { Field, Form } from 'svelte-forms-lib'
    import { Modal } from '@lib/components'
    import { H5 } from '@ollopa/cedar'
    import * as yup from 'yup'

    export let active = false

    const dispatch = createEventDispatcher()
    const form = {
        initialValues: {
            name: '',
            email: '',
            github: '',
        },
        validationSchema: yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
        }),
        onSubmit: async values => {
            dispatch('submit', { ...values })
        }
    }
</script>

<Modal {active} on:inactive={() => dispatch('cancel', { message: 'user canceled operation' })}>
    <H5>Before you submit, we need to know some details.</H5>

    <Form {...form}>
        <label>name</label>
        <Field name='name' placeholder='lex fridmen' />
        
        <label>email</label>
        <Field name='email' placeholder='geosnot@gmail.com' />
    
        <button type='submit'>submit</button>
    </Form>
</Modal>