<script>
  import { Card, CardBody, Collapse } from "sveltestrap";
  import { formatDayEntry } from "../Utils";
  import CartAdder from "./CartAdder.svelte";

  export let title, availList, type;
  export let onBaseQuantityChange;

  export let isOpen = false;
</script>

<Card class="mt-4" color="dark">
  <CardBody class="text-white fs-4 p-1">
    <div class="p-2" on:click={() => (isOpen = !isOpen)}>{title}</div>
    <Collapse {isOpen}>
      {#each availList as availableElement}
        <CartAdder
          entryName={type === "product"
            ? formatDayEntry(availableElement.day)
            : availableElement.product.name}
          entryDescription={availableElement.product.description}
          quantity={availableElement.requestedQuantity}
          onQuantityChange={(qty) =>
            onBaseQuantityChange(availableElement, qty)}
        />
      {/each}
    </Collapse>
  </CardBody>
</Card>

<style>
</style>
