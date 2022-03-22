<script lang="ts">
import { toTitleCase } from "$lib/title";

import type { JsonBool } from "$lib/types/json";

  import type { Writable } from "svelte/store";


  export let name: string;
  export let multi: Writable<JsonBool>;

  multi.update(v => {
    v[name] = false;

    return v;
  });

  let visible = false;

  multi.subscribe(v => (visible = v[name]));
  
</script>

{#if visible}
  <div class="step">
    {#if name !== 'default'}
      <h4>{toTitleCase(name)}</h4>
      {:else}
      <h4>Basic Information</h4>
    {/if}
    <slot />
  </div>
{/if}
<style lang="scss">
  .step {
    display: flex;
    flex-direction: column;
  }
</style>
