<script>
  /* Creating custom events to emit to parent component. Import createEventDispatcher from svelte */
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let title;
  export let price;
  export let id;
  /* Assign a default value to avoid 'expected prop' errors. */
  export let bestseller = false;

  function addToCart() {
    /* Use the dispatch object created, and then pass the 'event' as the first argument with an optional second object with data being passed. */
    dispatch("add-to-cart", {id});
  }

</script>

<article>
  <h1>{title}</h1>
  {#if bestseller}
    <h4>BEST SELLER!</h4>
  {/if}
  <h2>${price}</h2>
  <button on:click="{addToCart}">Add to Cart</button>
  <!-- You can also use inline functions to dispatch
  events upward. -->
  <button
    on:click="{
      () => dispatch("delete", {id})}">
    Delete
  </button>

</article>


<style>
  h4 {
    background-color: yellow;
  }

</style>
