<script>
  import MeetupItem from "./MeetupItem.svelte";
  import MeetupFilter from "./MeetupFilter.svelte";
  import Button from "../UI/Button.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";


  export let meetups;

  let faveOnly;

  $: filteredMeetups = faveOnly ? meetups.filter(
    item => item.favourite
  ) : meetups;

  function setFilter(event) {
    faveOnly = event.detail === 1;
  }

</script>


<section class="meetup-controls">
  <MeetupFilter
    on:select={setFilter}
  />
  <Button
    on:click="{() => dispatch("add")}">
      Submit New Event
  </Button>
</section>
<section id="meetups">
  {#each filteredMeetups as meetup (meetup.id)}
  <div transition:scale animate:flip={{duration: 300}}>
    <MeetupItem
      id={meetup.id}
      title={meetup.title}
      subtitle={meetup.subtitle}
      address={meetup.address}
      imageUrl={meetup.imageUrl}
      description={meetup.description}
      isFave={meetup.favourite}
      on:showdetails
      on:editmeetup
    />
  </div>
  {/each}
</section>


<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  .meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }


</style>
