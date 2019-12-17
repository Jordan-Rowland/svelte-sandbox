<script>
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";
  import Header from "./UI/Header.svelte";
  import Button from "./UI/Button.svelte";

  let editMode;

  // $: console.table(meetups)

  let meetups = [
    {
      id: "m1",
      title: "Python Bootcamp",
      subtitle: "Learn to code in 276 years",
      description: "In this meetup, we will have some total beginners to teach you how to code! Badly!",
      imageUrl: "https://3t7bol18ef963l8x6yzv7ja1-wpengine.netdna-ssl.com/wp-content/uploads/2017/07/on-ground_coding_bootcamps_2.jpg",
      address: "421 Evergreen Terrace, Springfield 52413",
      contact: "code@douletran.com",
      favourite: false,
    },
    {
      id: "m2",
      title: "JS Bootcamp",
      subtitle: "Learn to code in 6 minues",
      description: "In this meetup, we don't even know what to do! JS is so weird lol",
      imageUrl: "https://brokeassstuart-9uzlt3u.netdna-ssl.com/wp-content/pictsnShit/2016/06/coding-bootcamp.jpg",
      address: "123 Fake Street, Springfield 51423",
      contact: "code@douletran.com",
      favourite: false,
    }
  ]

  function addMeetup(event) {
    const newMeetup = {
      id: `m${Math.random().toString()}`,
      title: event.detail.title,
      subtitle: event.detail.subtitle,
      description: event.detail.description,
      imageUrl: event.detail.imageUrl,
      address: event.detail.address,
      contact: event.detail.contact,
    };

    meetups = [newMeetup,...meetups]

    editMode = false;
  }

  function toggleFavourite(event) {
    const id = event.detail;
    const updatedMeetup = {
      ...meetups.find(m => m.id === id)};
    updatedMeetup.favourite = !updatedMeetup.favourite;
    const meetupIndex = meetups.findIndex(m => m.id === id);
    const updatedMeetupArray = [...meetups];
    updatedMeetupArray[meetupIndex] = updatedMeetup;
    meetups = updatedMeetupArray;
  };

</script>

<Header />

<main>

{#if editMode}
  <EditMeetup
  on:addnewevent={addMeetup}
  on:cancelmodal={() => editMode = false}/>

{:else}
  <div class="meetup-controls">
    <Button
      on:click="{() => editMode = true}">
      Submit New Event
    </Button>
  </div>
  <MeetupGrid
    {meetups}
    on:togglefavourite="{toggleFavourite}"
    />
{/if}

</main>





<style>
  main {
    margin-top: 5rem;
  }

.meetup-controls {
margin: 1rem;
}
</style>
