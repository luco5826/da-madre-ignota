<script>
  import { Card, CardBody, Collapse } from "sveltestrap";
  import CartAdder from "./CartAdder.svelte";

  export let index, day, availList;
</script>

<Card class="mt-4" color="dark">
  <CardBody class="text-white fs-4 p-1">
    <div class="p-3" id={`toggler-${index}`}>{day}</div>
    <Collapse toggler={`#toggler-${index}`}>
      {#each availList as availableElement}
        <CartAdder
          entryName={availableElement.entry.name}
          entryDescription={availableElement.entry.description}
          onQuantityChange={(qty) =>
            console.log("New quantity:", qty, availableElement)}
        />
      {/each}
    </Collapse>
  </CardBody>
</Card>

<style>
</style>
