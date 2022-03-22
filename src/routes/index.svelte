<script lang="ts" context="module">
    export const prerender = false;
</script>
<script lang="ts">
    import { page } from '$app/stores';

    import FormWrapper from '$lib/components/form-wrapper.svelte';
    import Header from '$lib/components/header.svelte';
    import Input from '$lib/components/input.svelte';
    import Step from '$lib/components/Step.svelte';
    import {schema} from '$lib/form-schema.store'
    import { parseSchema } from '$lib/parse-schema';
    import { auth0Session } from '$lib/session.store';
    import type { Form } from '$lib/types/form';
    import { validateAndParseInput } from '$lib/validate-input';
    import { onMount } from 'svelte';
    import { camelCase } from 'lodash';
    let err;


    onMount(async () => {
        const sessionToken = $page.url.searchParams.get('session_token')
        const state = $page.url.searchParams.get('state')
        auth0Session.init({sessionToken, state})
        try {
            const formInput = await validateAndParseInput(sessionToken)
            schema.init(formInput as Form)
        } catch (error) {
            err = error
        }
    })


    $: printableSchema = parseSchema($schema)
    $: formNames = printableSchema.map(form => camelCase(form.title))
</script>

<Header {err} title={$schema.title}/>


{#if printableSchema.length}
<FormWrapper name={$schema.title} let:multi forms={formNames}>
    {#each printableSchema as step}

        <Step name={step.title} {multi} let:store>
        {#each Object.entries(step.properties) as [key, element]}
            <Input {store} type={element.type} name={key} placeholder={element.label}/>
        {/each}
        </Step>
    {/each}
</FormWrapper>
{/if}



<style lang="scss">
    p {
        color: #65676e;
    }
</style>