<script>
  import {
    createEventDispatcher,
    onMount,
    onDestroy,
    beforeUpdate,
    afterUpdate
  } from "svelte";
  const dispatch = createEventDispatcher();

  const closeModal = () => {
    dispatch("cancel-modal");
    console.log('Modal cancelled')
  }

  let agreed = false;
  let autoscroll = false;

  onMount(
    () => console.log("onMount")
  );

  beforeUpdate(() => {
    console.log("Before Update");
    autoscroll = agreed;
  });

  afterUpdate(() => {
    console.log("After Update");
    if (autoscroll) {
      const modal = document.querySelector(".modal");
      modal.scrollTo(0, modal.scrollHeight);
    }
  });

  onDestroy(
    () => console.log("onDestroy")
  );

  console.table("Script executed")
</script>

<div class="backdrop"
    on:click={closeModal}></div>
  <div class="modal">
    <header>
      <slot name=header/>
    </header>
  <div>
    <!-- If you have an unnamed slot, then that slot will be the default for any content that doens't target a named slot. -->
    <slot />
  </div>
  <div class="disclaimer">
    <h6>Before you close, you must agree to our terms!</h6>
    <button on:click="{() => agreed = true}">
      Agree
    </button>
  </div>
  <footer>
    <!-- You can provide default content for a slot -->
    <slot name="footer" didAgree={agreed}>
      <!-- For the didAgree section 6 video 64, 'Using Prop Slots' -->
      <button on:click={() => dispatch("close-modal")}
        disabled={!agreed}>
        Close
      </button>
    </slot>
  </footer>
</div>



<style>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  z-index: 10;
}

.modal {
  padding: 1rem;
  position: fixed;
  top: 10vh;
  left: 10%;
  width: 80%;
  max-height: 20vh;
  background: white;
  border-radius: 5px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  overflow: scroll;
}

</style>
