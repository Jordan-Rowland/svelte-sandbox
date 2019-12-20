<script>
  import { onMount } from "svelte";
  import List from "./Notes/List.svelte";

  onMount(() => {
    getLists();
  });

  let lists = [];
  let listName;

  async function getLists() {
    const res = await fetch(
      "http://localhost:3000/lists");
    const resJson = await res.json();
    lists = resJson.lists;
    console.log(lists);
  }

  async function addList() {
    const res = await fetch(
      "http://localhost:3000/addList", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({name: listName}),
      }
    );
    lists = [await res.json(), ...lists];
  }

</script>


<input type="text" name="newList" bind:value={listName}>
<button
  on:click={addList}>Add List</button>

<div class="column">
{#if lists}
  {#each lists as list, index (list.id)}
    <List name={list.name} id={list.id} class="notes"/>
  {/each}
{/if}
</div>

<style>

/*.notes {
  display: inline-flex;
}*/

.column {
  display: flex;
  flex-wrap: wrap;
}

</style>
