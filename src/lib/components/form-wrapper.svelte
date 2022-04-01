<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import type { Writable } from "svelte/store";
      
    import type { JsonBool } from "$lib/types/json";
    import { auth0Session, type Auth0Session } from "$lib/session.store";
    import type { Theme } from "$lib/types/form";
  
    export let forms = []
    export let theme: Theme;

    const multi: Writable<JsonBool> = writable({});
  
    let multi_loc: JsonBool = {};
    let current = 0;
  
    multi.subscribe(v => (multi_loc = v));
    
    let accentColor = "#635dff"
    if(theme?.accentColor) {
      accentColor = theme.accentColor;
    }
  
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
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    let continueForm: Auth0Session;
    const onSubmit = async () => {
      const result = {};
      for(const form of forms) {
        const formAsJson = JSON.parse(sessionStorage.getItem(form));
        if (form === 'default') {
          Object.assign(result, formAsJson);
        } else {
          result[form] = formAsJson
        }
      }
      auth0Session.dispatch(result)
      auth0Session.subscribe(async (data) => {
        continueForm = data;
        const form = document.getElementById('continueForm')
        await sleep(25)
        if (form) {
          form.submit()
        }
      })
    }

    onMount(() => {
      multi.update(v => {
        v[Object.keys(multi_loc)[current]] = true;
  
        return v;
      });
    });
   
  </script>

  {#if continueForm}
    <form id="continueForm" action={continueForm.action} method="post" class="hidden-form">
      <input type="hidden" name="continueToken" value={continueForm.continueToken}>
      <input type="hidden" name="state" value={continueForm.state}>
    </form>
  {/if}

  
  <form on:submit|preventDefault={onSubmit} {...$$restProps} style="--accent-color={accentColor};">
    <slot {multi} />
  
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
    .hidden-form {
      border: none !important;
      padding: 0px !important;
      margin: 0px !important;
    }
    form {
      display: flex;
      flex-direction: column;
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
      background-color: var(--accent-color);
    }
  </style>