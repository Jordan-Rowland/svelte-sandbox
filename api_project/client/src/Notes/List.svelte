<script>
  import { onMount } from "svelte";
  import Note from "./Note.svelte";

  export let id;
  export let name;

  let notes;
  $: notes;

  async function getNotes() {
    const res = await fetch(
      `http://localhost:3000/list/${id}/notes`);
      // "http://localhost:3000/notes");
    const resJson = await res.json();
    notes = resJson.notes;
  }

  onMount(() => {
    getNotes();
  });

  let newNote = "Test note";
  $: console.log(newNote);

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
    console.log(await res);
    let updatedNotes = notes.filter(
      note => note.id !== selectedId
    );
    notes = updatedNotes;
  }

</script>

<section>
<div class="list">
<div>
{name}
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

.list {
  background-color: hsla(258, 100%, 61%, 1);
  margin: 20px;
  display: flex;
  flex-direction: column;
  min-width: 20vw;
  max-width: 30vw;
}

.new-list {
  margin: 10px auto;
}

section {
  display: inline;
}

</style>
