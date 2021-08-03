<script>
  import { Card, CardBody, Collapse } from "sveltestrap";
  import CartAdder from "./CartAdder.svelte";

  export let day, availList;
  export let onBaseQuantityChange;

  export let isOpen = false;
</script>

<Card class="mt-4" color="dark">
  <CardBody class="text-white fs-4 p-1">
    <div class="p-2" on:click={() => (isOpen = !isOpen)}>{day}</div>
    <Collapse {isOpen}>
      {#each availList as availableElement}
        <CartAdder
          entryName={availableElement.entry.name}
          entryDescription={availableElement.entry.description}
          quantity={availableElement.quantity}
          onQuantityChange={(qty) =>
            onBaseQuantityChange(availableElement, qty)}
        />
      {/each}
    </Collapse>
  </CardBody>
</Card>

<style>
</style>
