<script lang="ts">
	import type { SelectOption } from '$lib/types/form-element';

	import type { JsonBool, JsonString } from '$lib/types/json';

	import { createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let store: Writable<JsonString | JsonBool>;
	export let name: string;
	export let options: SelectOption[];

	const dispatch = createEventDispatcher();

	let value: string | boolean;
	let bool: boolean = false;

	store.subscribe((v) => {
		console.log(v);
		switch ($$restProps.type) {
			case 'checkbox':
				bool = v[name] as boolean;
				break;
			case 'select':
				break;
			default:
				value = v[name];
				break;
		}
	});

	$: store.update((v) => {
		if (!value) {
			v[name] = bool;
		} else {
			v[name] = value;
		}
		return v;
	});
</script>

{#if $$restProps.type === 'select'}
	<div class="form-group">
		<label for={name}>{$$restProps.placeholder}</label>
		<select {name} id={name} class="form-select" bind:value>
			{#each options as option}
				<option value={option.value} selected={option.value === value}>{option.label}</option>
			{/each}
		</select>
	</div>
{:else if $$restProps.type === 'checkbox'}
	<div class="form-check">
		<input class="form-check-input" type="checkbox" id={name} bind:checked={bool} />
		<label class="form-check-label" for={name}>
			{$$restProps.placeholder}
		</label>
	</div>
{:else}
	<div class="form-group">
		<label for={name}>{$$restProps.placeholder}</label>
		<input id={name} {...$$restProps} class="form-control" bind:value />
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
