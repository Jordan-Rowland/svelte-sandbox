<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  let dispatch = createEventDispatcher();

  import Note from "./Note.svelte";

  export let id;
  export let name;

  let notes;
  let newNote;

  onMount(() => {
    getNotes();
  });


  async function getNotes() {
    const res = await fetch(
      `http://localhost:3000/list/${id}/notes`);
    const resJson = await res.json();
    notes = resJson.notes;
  }


  async function addNote() {
    const res = await fetch(
      "http://localhost:3000/addNote", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({body: newNote, id: id}),
      }
    );
    notes = [await res.json(), ...notes];
    newNote = "";
  }


  async function deleteNote(event) {
    const selectedId = event.detail;
    const res = await fetch(
      `http://localhost:3000/deleteNote/${selectedId}`, {method: "DELETE"}
    );
    let updatedNotes = notes.filter(
      note => note.id !== selectedId
    );
    notes = updatedNotes;
  }


  function deleteList() {
    dispatch("delete-list", id);
  }

</script>

<section>
<div class="list">
<div>
  <div class="name">
    {name}
    <span class="delete-list"
      on:click={deleteList}>X</span>
  </div>
</div>
<div class="new-list">
  <input type="text" name="new-note" bind:value={newNote}>
  <button on:click={addNote}>Add New Note</button>
</div>

{#if notes}
  {#each notes as note (note.id)}
    <Note noteBody={note.body} id={note.id}
      on:delete-note={deleteNote}/>
  {/each}
{/if}
</div>
</section>

<style>

.name {
  background-color: hsla(258, 100%, 51%, 1);
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  margin: 5px;
  color: hsla(258, 100%, 99%, 1);
  font-weight: 800;
}

.delete-list {
  background-color: hsla(258, 100%, 61%, 1);
  padding: 0 0.25rem;
}

.delete-list:hover {
  cursor: pointer;
}

.list {
  background-color: hsla(258, 100%, 61%, 1);
  margin: 20px;
  display: flex;
  flex-direction: column;
  min-width: 30vw;
  max-width: 30vw;
}

.new-list {
  margin: 10px auto;
  max-width: 75%;
  min-width: 15%;
}

</style>
