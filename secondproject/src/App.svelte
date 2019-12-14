<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import TextInput from "./UI/TextInput.svelte";
  import Button from "./UI/Button.svelte";

  let meetups = [
    {
      id: "m1",
      title: "Python Bootcamp",
      subtitle: "Learn to code in 276 years",
      description: "In this meetup, we will have some total beginners to teach you how to code! Badly!",
      imageUrl: "https://3t7bol18ef963l8x6yzv7ja1-wpengine.netdna-ssl.com/wp-content/uploads/2017/07/on-ground_coding_bootcamps_2.jpg",
      address: "421 Evergreen Terrace, Springfield 52413",
      contact: "code@douletran.com"
    },
    {
      id: "m2",
      title: "JS Bootcamp",
      subtitle: "Learn to code in 6 minues",
      description: "In this meetup, we don't even know what to do! JS is so weird lol",
      imageUrl: "https://brokeassstuart-9uzlt3u.netdna-ssl.com/wp-content/pictsnShit/2016/06/coding-bootcamp.jpg",
      address: "123 Fake Street, Springfield 51423",
      contact: "code@douletran.com"
    }
  ]

  let title = "";
  let subtitle = "";
  let description = "";
  let address = "";
  let contact = "";
  let imageUrl = "";

  function addMeetup() {
    const newMeetup = {
      id: `m${Math.random().toString()}`,
      title,
      subtitle,
      description,
      imageUrl,
      address,
      contact,
    };

    meetups = [newMeetup,...meetups]
  }

</script>

<Header />

<main>
  <form on:submit|preventDefault={addMeetup}>
    <!--
      on:input needs an inline function because bind:
      will not work on components like this.
     -->
    <TextInput
      id="subtitle"
      label="Subtitle"
      type="text"
      value={subtitle} on:input="{
        event => subtitle = event.target.value
      }"
    />
    <TextInput
      id="address"
      label="Address"
      type="text"
      value={address} on:input="{
        event => address = event.target.value
      }"
    />
    <TextInput
      id="imageUrl"
      label="Image URL"
      type="text"
      value={imageUrl} on:input="{
        event => imageUrl = event.target.value
      }"
    />
    <TextInput
      id="contact"
      label="Contact Email"
      type="email"
      value={contact} on:input="{
        event => contact = event.target.value
      }"
    />
    <TextInput
      controlType="textarea"
      id="description"
      label="Description"
      type="text"
      rows=3
      value={description} on:input="{
        event => description = event.target.value
      }"
    />
    <Button type="submit" caption="Save" />
  </form>


  <MeetupGrid
    {meetups}
  />
</main>





<style>
  main {
    margin-top: 5rem;
  }

  form {
    width: 30rem;
    max-width: 90%;
    margin: auto;
  }
</style>
