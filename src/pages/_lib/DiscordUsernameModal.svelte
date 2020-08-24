<script lang='ts'>
    import { createEventDispatcher } from 'svelte'
    import { Field, Form, ErrorMessage } from 'svelte-forms-lib'
    import { Modal } from '@lib/components'
    import { Spacer } from '@ollopa/cedar'
    import * as yup from 'yup'

    export let active = false

    const dispatch = createEventDispatcher()
    const form = {
        initialValues: { username: '' },
        validationSchema: yup.object().shape({
            username: yup.string().required(),
        }),
        onSubmit: async values => {
            dispatch('submit', { ...values })
        }
    }
</script>

<!-- TODO Refactor this & UserModal into notifications.ask(question, fields) -->
<Modal {active} on:close={() => dispatch('cancel', { message: 'user canceled operation' })}>
    <div class='header'>What is your discord username that is on the google sheet?</div>

    <Spacer s={6} />

    <Form {...form}>
        <label>username</label>
        <Field class='form-field' name='username' placeholder='pjlao307' />
        <ErrorMessage class='form-error' name='username' />

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

    button {
        border-radius: var(--buttonBorderRadius);
        padding: var(--buttonPadding);
        color: var(--black);
        background: var(--white);
        width: 100%;
        font-weight: bolder;
    }
</style>