<script>
  import { Button, Card, CardBody, CardFooter } from "sveltestrap";

  export let entryName, entryDescription, onQuantityChange;
  export let quantity = 0;

  function handleClick(value) {
    quantity = quantity + value;
    onQuantityChange(quantity);
    return false;
  }
</script>

<Card class="text-start fs-5 m-2 inner-card">
  <CardBody class="d-flex align-items-center justify-content-between">
    <span style="max-width: 60%;">{entryName}</span>
    <div>
      <Button
        color="primary"
        disabled={quantity === 0}
        on:click={() => handleClick(-1)}>-</Button
      >
      <span>{quantity}</span>
      <Button color="primary" on:click={() => handleClick(+1)}>+</Button>
    </div>
  </CardBody>
  {#if entryDescription !== undefined}
    <CardFooter class="fs-6">
      {entryDescription}
    </CardFooter>
  {/if}
</Card>

<style>
</style>
