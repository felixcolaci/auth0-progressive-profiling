<script lang="ts">
import { toTitleCase } from "$lib/title";


    export let title;
    export let subheading;
    export let logoUrl;
    export let err;
</script>

{#if !err}

    {#if !logoUrl}
        <h1>{toTitleCase(title)}</h1>
    {:else}
        <div class="d-flex align-items-center text-dark text-decoration-none header">
            <img width="40" height="40" alt="logo" src={logoUrl} class="bi me-2">
            <h1 class="fs-4">{toTitleCase(title)}</h1>
        </div>
    {/if}

    {#if subheading}
        <p>{subheading}</p>   
    {/if}
{:else}
<div class="alert alert-danger">
    <span>Your session seems invalid. Try again or contact your sales engineer of choice.</span>
    <p>{err.message}</p>
</div>
{/if}

<style lang="scss">
    .header {
        margin-bottom: .5em;
    }
</style>