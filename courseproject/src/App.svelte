<script>
import MeetupGrid from "./Meetups/MeetupGrid.svelte";
import EditMeetup from "./Meetups/EditMeetup.svelte";
import MeetupDetail from "./Meetups/MeetupDetail.svelte";
import Header from "./UI/Header.svelte";
import Button from "./UI/Button.svelte";
import meetups from "./Meetups/meetups-store.js";
import LoadingSpinner from "./UI/LoadingSpinner.svelte";

import { onMount } from "svelte";

onMount(async () => {
  const res = await fetch("https://svelte-meetus-ec364.firebaseio.com/meetups.json");
  const response = await res.json();
  const loadedMeetups = [];
  for (const key in response) {
    loadedMeetups.push({ id: key, ...response[key] });
  }
  setTimeout(() => {
    isLoading = false;
    meetups.setMeetups(loadedMeetups.reverse());
  } , 500);
});

let isLoading = true;
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
  {#if isLoading}
    <LoadingSpinner />
  {:else}
    <MeetupGrid meetups={$meetups}
      on:showdetails={showDetails}
      on:editmeetup={startEdit}
      on:add={() => editMode = 'edit'}
    />
  {/if}
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
