<script lang="ts">
import { toTitleCase } from "$lib/title";


    export let title;
    export let err;
</script>

{#if !err}
    <h1>{toTitleCase(title)}</h1>
    <p>We need additional information before you start using our service.</p>
{:else}
<div class="alert alert-danger">
    <span>Your session seems invalid. Try again or contact your sales engineer of choice.</span>
    <p>{err.message}</p>
</div>
{/if}