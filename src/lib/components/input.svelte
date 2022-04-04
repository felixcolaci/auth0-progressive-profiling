<script lang="ts">
import type { SelectOption } from "$lib/types/form-element";

    import type { JsonString } from "$lib/types/json";

    import { createEventDispatcher } from "svelte";
    import type { Writable } from "svelte/store";
  
  
    export let store: Writable<JsonString>;
    export let name: string;
    export let options: SelectOption[]
  
    const dispatch = createEventDispatcher();
  
    let value: string;
  
    store.subscribe((v) => {
      if ($$restProps.type !== "select") {
        value = v[name]
      }
    });
    
    $: store.update((v) => {
      console.log(value)
      v[name] = value;
      return v;
    })  
  
  </script>
  
  {#if $$restProps.type === "select"}
  <div class="form-group">
    <label for={name}>{$$restProps.placeholder}</label>
    <select name={name} id={name} class="form-select" bind:value>
      {#each options as option}
        <option value={option.value} selected={option.value === value}>{option.label}</option>
      {/each}
    </select>  
  </div>
    
  {:else}
    <div class="form-group">
      <label for={name}>{$$restProps.placeholder}</label>
      <input id={name} {...$$restProps} class="form-control"  bind:value>
    </div>
  {/if}


<style lang="scss">
    .form-group {
        margin-top: 1em;
    }
    label {
        font-weight: bolder;
    }
</style>