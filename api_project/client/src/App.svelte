<script>
  // import {
  //   getNotes,
  //   addNote,
  //   deleteNote,
  // } from "./api-helpers.js"
  import Note from "./Notes/Note.svelte";

  import { onMount } from "svelte";

  let notes;
  $: console.log(notes);

  async function getNotes() {
    const res = await fetch(
      "http://localhost:3000/notes");
    const resJson = await res.json();
    notes = resJson.notes;
  }

  onMount(() => {
    getNotes();
  });

  let newNote = "Test note";

  async function addNote() {
    const res = await fetch(
      "http://localhost:3000/notes", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({body: newNote}),
      }
    );
    notes = [...notes, await res.json()];
    newNote = "";
  }

  async function deleteNote(event) {
    const selectedId = event.detail;
    const res = await fetch(
      `http://localhost:3000/note/${selectedId}`, {method: "DELETE"}
    );
    console.log(await res);
    let updatedNotes = notes.filter(
      note => note.id !== selectedId
    );
    notes = updatedNotes;
  }

</script>

<button on:click={getNotes}>Get Notes</button>
<div>
  <input type="text" name="new-note" bind:value={newNote}>
  <button on:click={addNote}>Add New Note</button>
</div>

{#if notes}
  {#each notes as note (note.id)}
    <Note noteBody={note.body} id={note.id}
      on:delete-note={deleteNote}/>
  {/each}
{/if}

<style>



</style>
