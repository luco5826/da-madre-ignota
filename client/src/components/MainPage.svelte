<script>
  import { Alert, TabContent, TabPane } from "sveltestrap";
  import { scale } from "svelte/transition";
  import IoMdCart from "svelte-icons/io/IoMdCart.svelte";

  import DayCard from "./DayCard.svelte";
  import ProductCard from "./ProductCard.svelte";
  import * as API from "../API";
  import { formatDayEntry, groupByDay, groupByProduct } from "../Utils";
  import { onMount } from "svelte";
  import CheckoutModal from "./CheckoutModal.svelte";

  let menuAvail = [];
  let byDay = {};
  let byProduct = {};
  let showCartIcon = false,
    showModal = false,
    showAlert = false,
    closeAllCards = true;

  onMount(async () => {
    menuAvail = await API.getAvailability();
    byDay = groupByDay(menuAvail);
    byProduct = groupByProduct(menuAvail);
  });

  function changeQuantity(element, quantity) {
    const found = menuAvail.find((o) => o.id === element.id);
    found.quantity = quantity;
    menuAvail = [...menuAvail];
  }
  async function onCompleteOrder(userInfos) {
    showModal = false;

    await API.sendOrder({ products: menuAvail, user: userInfos });

    showAlert = true;
    setTimeout(() => location.reload(), 2000);
  }

  // Show cart icon whenever there's at least something in the cart
  $: showCartIcon = menuAvail.filter((m) => m.quantity > 0).length > 0;
</script>

<main>
  <h1>Ordini<br />da madre ignota</h1>
  {#if showAlert}
    <Alert color="success">Grazie per aver ordinato!</Alert>
  {/if}

  <TabContent
    on:tab={(e) => {
      // Ugly workaround for svelte to re-set the isOpen prop to the cards
      // Without this, svelte would not detect any change and not reset the
      // cards' state
      closeAllCards = false;
      closeAllCards = true;
    }}
  >
    <TabPane tabId="days" tab="Giorni" active>
      {#each Object.keys(byDay).sort() as dayAvail}
        <DayCard
          isOpen={!closeAllCards}
          day={formatDayEntry(dayAvail)}
          availList={byDay[dayAvail]}
          onBaseQuantityChange={changeQuantity}
        />
      {/each}
    </TabPane>
    <TabPane tabId="products" tab="Prodotti">
      {#each Object.keys(byProduct).sort() as productAvail}
        <ProductCard
          isOpen={!closeAllCards}
          product={productAvail}
          availList={byProduct[productAvail]}
          onBaseQuantityChange={changeQuantity}
        />
      {/each}
    </TabPane>
  </TabContent>

  {#if showCartIcon}
    <div
      class="cart-button"
      transition:scale
      on:click={() => (showModal = true)}
    >
      <IoMdCart color="white" />
    </div>
  {/if}

  {#if showModal}
    <CheckoutModal
      open={showModal}
      toggleModal={() => (showModal = !showModal)}
      {onCompleteOrder}
    />
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    height: 100%;
  }

  h1 {
    font-size: 2rem;
    text-transform: uppercase;
    font-weight: 100;
  }
  .cart-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: var(--bs-blue);
    color: white;
    width: 60px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 4px 4px 20px 3px darkgray;
  }
</style>
