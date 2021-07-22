<script>
  import { Card, CardBody, Collapse } from "sveltestrap";
  import { formatDayEntry } from "../Utils";
  export let index, product, availList;
</script>

<Card class="mt-4" color="dark">
  <CardBody class="text-white fs-4" id={`toggler-${index}`}>
    {product}
    <Collapse toggler={`#toggler-${index}`}>
      {#each availList as availableElement}
        <h3>{formatDayEntry(availableElement.day)}</h3>
      {/each}
    </Collapse>
  </CardBody>
</Card>

<style>
</style>
