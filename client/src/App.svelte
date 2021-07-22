<script>
  import { TabContent, TabPane } from "sveltestrap";

  import DayCard from "./components/DayCard.svelte";
  import ProductCard from "./components/ProductCard.svelte";
  import * as API from "./API";
  import {
    daysOfWeek,
    formatDayEntry,
    groupByDay,
    groupByProduct,
  } from "./Utils";
  import { onMount } from "svelte";

  let menuAvail = [];
  let byDay = {};
  let byProduct = {};

  onMount(async () => {
    menuAvail = await API.getAvailability();
    byDay = groupByDay(menuAvail);
    byProduct = groupByProduct(menuAvail);
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
  />
</svelte:head>

<main>
  <h1>Ordini<br />da madre ignota</h1>

  <TabContent>
    <TabPane tabId="days" tab="Giorni" active>
      {#each Object.keys(byDay).sort() as dayAvail, index}
        <DayCard
          {index}
          day={formatDayEntry(dayAvail)}
          availList={byDay[dayAvail]}
        />
      {/each}
    </TabPane>
    <TabPane tabId="products" tab="Prodotti">
      {#each Object.keys(byProduct).sort() as productAvail, index}
        <ProductCard
          {index}
          product={productAvail}
          availList={byProduct[productAvail]}
        />
      {/each}
    </TabPane>
  </TabContent>
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
</style>
