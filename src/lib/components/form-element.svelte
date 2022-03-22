<script lang="ts">
import type { FormElement } from "$lib/types/form-element";


    export let element: FormElement;
    export let key: string;
</script>

<div class="form-group">
    <label for={key}>{element.label}</label>
    <input id={key} type={element.type} class="form-control">
</div>

<style lang="scss">
    label {
        text-transform: capitalize;
    }
</style>