<script lang="ts">
  export let separator = " ";
  export let items: any[] = [];
  export let transformer = (x) => x;
</script>

{#each items as item, i}
  {transformer(item)}{#if i < items.length - 1}{@html separator}{/if}
{/each}
