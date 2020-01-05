<script>
  import { onDestroy } from "svelte";
  import cartItems from "./cart-store.js";
  import CartItem from "./CartItem.svelte";


/////////////////////////////////////////////////////////
//// You can manually set up subscriptions like the ////
//// code below, but you can use a shortcut Svelte ////
//// provides by prepending the variable with a   ////
////'$':  $cartItems                             ////
//// Use it in the markup below. For variables  ////
//// starting with a $, Svelte assumes they    ////
//// are stores.                              ////
/////////////////////////////////////////////////

  // $: console.log($cartItems);


  // If you need to do something with the store data, you
  // may still need to use the below methods. If all you
  // need to do is get it and output it, you can use the
  // $store syntax method.

  // let items;

  // // To clear subscriptions, assign the subscribe function
  // // to a variable. Then...(below)
  // const cartSubscription = cartItems.subscribe(its => {
  //   items = its;
  // });

  // // ...Then, call that function on the 'onDestroy' lifecycle
  // // method.
  // onDestroy(() => {
  //   if (cartSubscription) {
  //     cartSubscription();
  //   }
  // });


  // export let items = [
  //   {
  //     id: "p1",
  //     title: "Test",
  //     price: 9.99
  //   },
  //   {
  //     id: "p2",
  //     title: "Test",
  //     price: 9.99
  //   }
  // ];


</script>

<section>
  <h1>Cart</h1>
  <ul>
    {#each $cartItems as item (item.id)}
      <CartItem id={item.id} title={item.title} price={item.price} />
    {:else}
      <p>No items in cart yet!</p>
    {/each}
  </ul>
</section>


<style>
  section {
    width: 30rem;
    max-width: 90%;
    margin: 2rem auto;
    border-bottom: 2px solid #ccc;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
