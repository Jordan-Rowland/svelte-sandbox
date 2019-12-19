<script>
  import { scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  import { createEventDispatcher } from "svelte";
  let dispatch = createEventDispatcher();

  export let noteBody;
  export let id;

  function deleteNote() {
    dispatch("delete-note", id);
  }

</script>

  <div id="note"
    transition:scale="{{duration: 250, delay: 10, opacity: 0.5, start: 0.5, easing: quintOut}}">
    {noteBody}
    <button on:click={deleteNote}>X</button>
  </div>


<style>

#note {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  padding: 12px;
  max-width: 25%;
  min-height: 10%;
  margin: 0.75rem;
}

#note:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

</style>
