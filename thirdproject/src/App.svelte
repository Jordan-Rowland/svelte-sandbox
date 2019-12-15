<script>
  import { tick } from 'svelte';
  import Product from "./Product.svelte";
  import Modal from "./Modal.svelte";

  let products = [
    {
      id: 'product1',
      title: "An Old Book",
      price: 7.99
    },
    {
      id: 'product2',
      title: "A New Book",
      bestseller: true,
      price: 8.99
    },
    {
      id: 'product3',
      title: "A Dumb Book",
      price: 3.99
    },
  ]

  let text = "This is the text";
  let modal = false;
  let closable = false;

  /* Extract data from custom events with event.detail to pass data up the component tree */
  function addToCart(event) {
    console.log(event.detail);
    modal = true;
  }

  function deleteProduct(event) {
    console.log(event.detail);
  }

  function transform(event) {
    if (event.which !== 9) {
      return;
    }
    event.preventDefault();
    const selectionStart = event.target.selectionStart;
    const selectionEnd = event.target.selectionEnd;
    const value = event.target.value;

    text = value.slice(0, selectionStart) +
           value.slice(selectionStart, selectionEnd).toUpperCase() +
           value.slice(selectionEnd);


    /* tick() is like afterUpdate/beforeUpdate but can be used inside of other functions.
    Seems like this is a Promise and needs .then */
    tick().then(() => {
      event.target.selectionStart = selectionStart;
      event.target.selectionEnd = selectionEnd;
    })
  }

</script>


<!-- Use on:<function name from dispatch> in the parent component. -->
{#each products as product, index}
<Product
  {...product}
  on:add-to-cart="{addToCart}"
  on:delete="{deleteProduct}"
  />
{/each}
<!-- You can use spread operator syntax to spread an object into the props. -->


{#if modal}
  <!-- To pass in data from the modal so  -->
  <Modal
  on:cancel-modal={() => modal = false}
  on:close-modal={() => modal = false}
  let:didAgree={closable}
  >
    <h1 slot="header">Here's a test!</h1>
    <p>This is a test for slots, homie.</p>
    <!-- to overwrite a default slot: -->
    <button slot="footer"
      on:click={() => modal = false}
      disabled={!closable}>
    Confirm</button>gss
  </Modal>
{/if}

<textarea rows="5" value={text}
  on:keydown={transform}></textarea>


<style>

</style>
