<script lang="ts" context="module">
    export const prerender = true;
    import './_global.scss';
</script>

<main class="content flex-shrink-0 container">
	<slot />
</main>

<style lang="scss">
    .content {
        margin-top: 5em;
    }
</style>