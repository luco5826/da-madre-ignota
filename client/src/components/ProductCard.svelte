<script>
  import { Card, CardBody, Collapse } from "sveltestrap";
  import { formatDayEntry } from "../Utils";
  import CartAdder from "./CartAdder.svelte";
  export let index, product, availList;
  export let onBaseQuantityChange;
</script>

<Card class="mt-4" color="dark">
  <CardBody class="text-white fs-4 p-1">
    <div class="p-2" id={`toggler-prod-${index}`}>{product}</div>
    <Collapse toggler={`#toggler-prod-${index}`}>
      {#each availList as availableElement}
        <CartAdder
          entryName={formatDayEntry(availableElement.day)}
          entryDescription={undefined}
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
