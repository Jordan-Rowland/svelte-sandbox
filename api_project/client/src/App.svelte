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
    lists = [...lists, await res.json()];
  }


  async function deleteList(event) {
    const selectedId = event.detail;
    const res = await fetch(
      `http://localhost:3000/deleteList/${selectedId}`, {method: "DELETE"}
    );
    let updatedLists = lists.filter(
      list => list.id !== selectedId
    );
    lists = updatedLists;
  }

</script>

<div id="app">

<input type="text" name="newList" bind:value={listName}>
<button
  on:click={addList}>Add List</button>

<div class="column">
{#if lists}
  {#each lists as list, index (list.id)}
    <List name={list.name} id={list.id} class="notes"
      on:delete-list={deleteList} />
  {/each}
{/if}
</div>

</div>


<style>

:global(body) {
  margin: 0;
  background-color: hsla(258, 100%, 91%, 1);
}


.column {
  display: flex;
  flex-wrap: wrap;
}

</style>
