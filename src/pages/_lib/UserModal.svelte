<script lang='ts'>
    import { createEventDispatcher } from 'svelte'
    import { Field, Form, ErrorMessage } from 'svelte-forms-lib'
    import { Modal } from '@lib/components'
    import { H5, Spacer } from '@ollopa/cedar'
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

<Modal {active} on:close={() => dispatch('cancel', { message: 'user canceled operation' })}>
    <div class='header'>To get this mask emailed to you, please provide your name and email.</div>

    <Spacer s={6} />

    <Form {...form}>
        <label>name</label>
        <Field class='form-field' name='name' placeholder='lex fridmen' />
        <ErrorMessage class='form-error' name='name' />

        <Spacer />
        
        <label>email</label>
        <Field class='form-field' name='email' placeholder='geosnot@gmail.com' />
        <ErrorMessage class='form-error' name='email' />
    
        <Spacer s={8} />

        <button id='user-form-submit' type='submit'>submit</button>
    </Form>
</Modal>

<style>
    .header {
        font-size: 1.25rem;
    }

    label {
        font-size: 1rem;
    }

    :global(.form-field) {
        padding: var(--inputPadding);
        font-weight: bold;
        border: 2px solid var(--black);
        background: var(--white);
        color: var(--black);
    }

    :global(.form-error) {
        display: block;
        color: var(--danger);
        padding-left: var(--s-4);
    }

    button {
        border-radius: var(--buttonBorderRadius);
        padding: var(--buttonPadding);
        color: var(--black);
        background: var(--white);
        width: 100%;
        font-weight: bolder;
    }
</style>