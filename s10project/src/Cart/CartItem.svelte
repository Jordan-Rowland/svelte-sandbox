<script>
  import { onDestroy } from "svelte";
  import { products } from "../Products/products-store.js";
  import cartItems from "../Cart/cart-store.js";
  import Button from "../UI/Button.svelte";


  export let title;
  export let price;
  export let id;

  let description = "Not available";
  let showDescription = false;
  // let fetchedProducts = [];

  // const prodSubscription = products.subscribe(
  //   prods => fetchedProducts = prods);


  // onDestroy(() => {
  //   prodSubscription();
  // });


  function displayDescription() {
    showDescription = !showDescription;
    // let selectedProduct = fetchedProducts.find(
    //   product => product.id === id
    // );
    // description = selectedProduct.description;

    // Short-term subscriptions, invoked only when
    // needed in this function, the immediately
    // unsubscribe.
    const prodSubscription = products.subscribe(
      products => {
        descriptions = products.find(
          p => p.id === id
        );
      }
    );
    prodSubscription()
  }


  function removeFromCart() {
    cartItems.update(items => {
      return items.filter(item => item.id !== id);
    });
  }
</script>


<li>
  <h1>{title}</h1>
  <h2>{price}</h2>
  <Button mode="outline" on:click={displayDescription}>
    {showDescription ? 'Hide Description' : 'Show Description'}
  </Button>
  <Button on:click={removeFromCart}>Remove from Cart</Button>
  {#if showDescription}
    <p>{description}</p>
  {/if}
</li>


<style>
  li {
    margin: 1rem 0;
    border-radius: 5px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 1rem;
  }

  h1,
  h2 {
    font-size: 1rem;
    margin: 0;
  }

  h2 {
    color: #494949;
    margin-bottom: 1rem;
  }
</style>
