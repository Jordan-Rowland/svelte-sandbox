<script>
/* jshint esversion: 8 */
import { onMount } from "svelte";
import hobbyStore from "./hobby-store.js";

// let hobbies = [];
let hobbyInput;
let isLoading = false;

onMount(async () => {
  isLoading = true;
  const res = await fetch('https://svelte-meetus-ec364.firebaseio.com/hobbies.json');
  const response = await res.json();
  console.log(response);
  // hobbies = Object.values(response);
  hobbyStore.setHobbies(Object.values(response));
  isLoading = false;
});

async function addHobby() {
  // hobbies = [...hobbies, hobbyInput.value];
  hobbyStore.addHobby(hobbyInput.value);
  isLoading = true;
  const res = await fetch(
    "https://svelte-meetus-ec364.firebaseio.com/hobbies.json", {
      method: "POST",
      body: JSON.stringify(hobbyInput.value),
      headers: {
        'Content-Type': "application/json"
      }
    });
  const response = await res.json();
  console.log(response);
  hobbyInput.value = "";
  isLoading = false;
}
</script>

<label for="hobby">Hobby</label>
<input
  type="text"
  bind:this={hobbyInput}
  id="hobby">
<button on:click={addHobby}>Add Hobby</button>

{#if isLoading}
  <p>Loading...</p>
{:else}
  <ul>
  {#each $hobbyStore as hobby}
    <li>{hobby}</li>
  {/each}
  </ul>
{/if}

<style>



</style>
