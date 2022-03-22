<script lang="ts">
import type { JsonString } from "$lib/types/json";

    import { createEventDispatcher } from "svelte";
    import type { Writable } from "svelte/store";
  
  
    export let store: Writable<JsonString>;
    export let name: string;
  
    const dispatch = createEventDispatcher();
  
    let value: string;
  
    store.subscribe((v) => (value = v[name]));
  
    const onInput = (e: Event) => {
      store.update(v => {
        v[name] = value;
  
        return v;
      });
  
      dispatch("input", e);
    };
  </script>
  
<div class="form-group">
    <label for={name}>{$$restProps.placeholder}</label>
    <input id={name} {...$$restProps} class="form-control"  bind:value on:input={onInput}>
</div>

<style lang="scss">
    .form-group {
        margin-top: 1em;
    }
    label {
        font-weight: bolder;
    }
</style>