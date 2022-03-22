<script lang="ts" context="module">
    export const prerender = false;
</script>
<script lang="ts">
import { page } from '$app/stores';

import FormWrapper from '$lib/components/form-wrapper.svelte';
import Input from '$lib/components/input.svelte';
import Step from '$lib/components/Step.svelte';
    import {schema} from '$lib/form-schema.store'
import { parseSchema } from '$lib/parse-schema';
import { auth0Session } from '$lib/session.store';
import { toTitleCase } from '$lib/title';
    import type { Form } from '$lib/types/form';
import { validateAndParseInput } from '$lib/validate-input';
import { onMount } from 'svelte';

    onMount(async () => {
        const sessionToken = $page.url.searchParams.get('session_token')
        const state = $page.url.searchParams.get('state')
        auth0Session.init({sessionToken, state})
        const formInput = await validateAndParseInput(sessionToken)
        schema.init(formInput as Form)
    })



    $: printableSchema = parseSchema($schema)
    $: console.log(printableSchema)
</script>

<h1>{toTitleCase($schema.title)}</h1>
<p>We need additional information before you start using our service.</p>

{#if printableSchema.length}
<FormWrapper name={$schema.title} let:store let:multi>
    {#each printableSchema as step}

        <Step name={step.title} {multi}>
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