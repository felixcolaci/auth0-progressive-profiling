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

    let textColor = "#65676e"
    let accentColor = "#635dff"
    let backgroundColor = "#ffffff"
    schema.subscribe(value => {
        if (value?.theme?.textColor) {
            textColor = value?.theme?.textColor
        }
        if (value?.theme?.accentColor) {
            accentColor = value?.theme?.accentColor
        }
        if (value?.theme?.backgroundColor) {
            backgroundColor = value?.theme?.backgroundColor
        }
    })

</script>
<body style="--text-color: {textColor}; --accent-color: {accentColor}; --background-color: {backgroundColor};">
    <div class="content flex-shrink-0 container global-container" style="--text-color: {textColor}; --accent-color: {accentColor}; --background-color: {backgroundColor};">

        <Header {err} title={$schema.title} subheading={$schema.subheading} logoUrl={$schema?.theme?.logoUrl}/>
    
    
        {#if printableSchema.length}
        <FormWrapper name={$schema.title} let:multi forms={formNames} theme={$schema?.theme}>
            {#each printableSchema as step}
        
                <Step name={step.title != $schema.title ? step.title : ''} {multi} let:store>
                {#each Object.entries(step.properties) as [key, element]}
                    <Input {store} type={element.type} name={key} placeholder={element.label} options={element.options}/>
                {/each}
                </Step>
            {/each}
        </FormWrapper>
        {/if}
    </div>
    
</body>




<style lang="scss">
    body {
        background-color: var(--background-color);  
        height: 100vh;
        width: 100vw;
        top: 0;
        position: absolute;
    }
    .global-container {
        width: 100%;
        margin-top: 5em;
        border-color: #c9cace;
        background-color: #fff;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.23);
        padding: 2em;
        }
    p {
        color: var(--text-color);
    }
</style>