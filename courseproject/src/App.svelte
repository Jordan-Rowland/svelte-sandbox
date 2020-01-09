<script>
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";
  import MeetupDetail from "./Meetups/MeetupDetail.svelte";
  import Header from "./UI/Header.svelte";
  import Button from "./UI/Button.svelte";

  import meetups from "./Meetups/meetups-store.js";

  let editMode;
  let editedId;
  let page = 'overview';
  let pageData = {};

  function saveMeetup() {
    editMode = null;
    editMode = null;
  }

  function cancelEdit() {
    editMode = null;
    editedId = null;
  }

  function showDetails(event) {
    page = 'details';
    pageData.id = event.detail;
  }

  function startEdit(event) {
    editMode = 'edit';
    editedId = event.detail;
  }

</script>

<Header />

<main>

{#if page === 'overview'}
  {#if editMode === 'edit'}
    <EditMeetup id={editedId}
      on:save={saveMeetup}
      on:cancelmodal={cancelEdit}
    />
  {/if}
    <MeetupGrid meetups={$meetups}
      on:showdetails={showDetails}
      on:editmeetup={startEdit}
      on:add={() => editMode = 'edit'}
    />
{:else}
  <MeetupDetail id={pageData.id}
    on:close={() => page = 'overview'}
    />
{/if}

</main>



<style>
main {
  margin-top: 5rem;
}

</style>
