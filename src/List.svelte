<script lang="ts">
  export let separator = " ";
  export let items: any[] = [];
</script>

{#each items as item, i}
  {item}{#if i < items.length - 1}{@html separator}{/if}
{/each}
