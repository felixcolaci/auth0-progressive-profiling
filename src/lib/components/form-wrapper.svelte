<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { writable } from "svelte/store";
    import type { Writable } from "svelte/store";
  
import type { JsonBool, JsonString } from "$lib/types/json";
import { local } from "$lib/localStore";
    
  
    export let name: string;
  
    const dispatch = createEventDispatcher();
  
    const store = name !== undefined ? local<JsonString>(name, {}) : writable({});
    const multi: Writable<JsonBool> = writable({});
  
    let multi_loc: JsonBool = {};
    let current = 0;
  
    multi.subscribe(v => (multi_loc = v));
  
    const onSubmit = (e: Event) => dispatch("submit", { e, store });
  
    function prev() {
      if (Object.keys(multi_loc)[current - 1]) {
        multi.update(v => {
          v[Object.keys(multi_loc)[current]] = false;
  
          return v;
        });
  
        current -= 1;
  
        multi.update(v => {
          v[Object.keys(multi_loc)[current]] = true;
  
          return v;
        });
      }
    }
  
    function next() {
      if (Object.keys(multi_loc)[current + 1]) {
        multi.update(v => {
          v[Object.keys(multi_loc)[current]] = false;
  
          return v;
        });
  
        current += 1;
  
        multi.update(v => {
          v[Object.keys(multi_loc)[current]] = true;
  
          return v;
        });
      }
    }
  
    onMount(() => {
      multi.update(v => {
        v[Object.keys(multi_loc)[current]] = true;
  
        return v;
      });
    });
  </script>
  
  <form on:submit|preventDefault={onSubmit} {...$$restProps}>
    <slot {store} {multi} />
  
    <div class="controls">
      {#if Object.keys(multi_loc)[current - 1]}
        <button class="btn btn-secondary" on:click|preventDefault={prev}>Previous</button>
      {/if}
  
      {#if Object.keys(multi_loc)[current + 1]}
        <button class="btn btn-secondary" on:click|preventDefault={next}>Next</button>
      {/if}
  
      {#if !Object.keys(multi_loc)[current + 1]}
        <button class="submit-btn btn btn-primary" type="submit">Submit</button>
      {/if}
    </div>



  </form>
  
  <style lang="scss">
    form {
      display: flex;
      flex-direction: column;
      border-color: #c9cace;
      border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.23);
      padding: 2em;
      & > div {
        margin-top: 1em;
      }
    }
    .controls {
      display: flex;
      justify-content: end;
      & > button {
        margin-top: 1em;
        max-width: 100px !important;
        align-self: center;
        border: 1px solid rgba(0, 0, 0, 0.23);
        border-color: #c9cace;
        padding: 8px 16px;
        &:focus {
          border: none;
          outline: none;
        }
        &:active {
          border: none;
          outline: none;
        }
      }
    }
    .submit-btn {
      margin-left: 1em;
    }
  </style>