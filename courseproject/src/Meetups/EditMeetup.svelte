<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import {
    notEmpty,
    isValidEmail
  } from "../helpers/validation.js";
  import meetups from "./meetups-store.js";


  export let id = null;

  let title = "";
  let subtitle = "";
  let address = "";
  let imageUrl = "";
  let contact = "";
  let description = "";
  $: titleValid = notEmpty(title);
  $: subtitleValid = notEmpty(subtitle);
  $: addressValid = notEmpty(address);
  $: imageUrlValid = notEmpty(imageUrl);
  $: contactValid = isValidEmail(contact);
  $: descriptionValid = notEmpty(description);

  if (id) {
    const unsubscribe = meetups.subscribe(
      items => {
        const selectedMeetup = items.find(
          item => item.id === id
        );
      title = selectedMeetup.title;
      subtitle = selectedMeetup.subtitle;
      address = selectedMeetup.address;
      imageUrl = selectedMeetup.imageUrl;
      contact = selectedMeetup.contact;
      description = selectedMeetup.description;
    });

    unsubscribe();
  }

  $: formIsValid = (
    titleValid &&
    subtitleValid &&
    addressValid &&
    imageUrlValid &&
    contactValid &&
    descriptionValid
  );

  function submitForm() {
    const meetupData = {
      title,
      subtitle,
      description,
      imageUrl,
      address,
      contact,
    };

    if (id) {
      meetups.updateMeetup(id, meetupData)
    } else {
      meetups.addMeetup(meetupData);
    }
    dispatch("save");
  }

  function cancelForm() {
    dispatch("cancelmodal");
  }

  function deleteMeetup() {
    meetups.removeMeetup(id);
    dispatch("save");
  }
</script>

<Modal title="Edit Meetup Data"
  on:cancelmodal>
<form on:submit|preventDefault={submitForm}>
  <!--
    on:input needs an inline function because bind:
    will not work on components like this.
   -->
    <TextInput
    id="title"
    label="Title"
    valid={titleValid}
    validityMessage="Please enter a valid title."
    value={title} on:input="{
      event => title = event.target.value
    }"
    />
  <TextInput
    id="subtitle"
    label="Subtitle"
    valid={subtitleValid}
    validityMessage="Please enter a valid subtitle."
    value={subtitle} on:input="{
      event => subtitle = event.target.value
    }"
    />
  <TextInput
    id="address"
    label="Address"
    valid={addressValid}
    validityMessage="Please enter a valid address."
    value={address} on:input="{
      event => address = event.target.value
    }"
    />
  <TextInput
    id="imageUrl"
    label="Image URL"
    valid={imageUrlValid}
    validityMessage="Please enter a valid url."
    value={imageUrl} on:input="{
      event => imageUrl = event.target.value
    }"
    />
  <TextInput
    id="contact"
    label="Contact Email"
    valid={contactValid}
    validityMessage="Please enter a valid email."
    type="email"
    value={contact} on:input="{
      event => contact = event.target.value
    }"
    />
  <TextInput
    controlType="textarea"
    id="description"
    label="Description"
    valid={descriptionValid}
    validityMessage="Please enter a valid description."
    bind:value={description}
    />
</form>

<div slot="footer">
  <Button type="button"
    mode="outline"
    on:click={cancelForm}>Cancel</Button>
  <Button type="button"
    disabled={!formIsValid} on:click={submitForm}>Save</Button>
  {#if id}
    <Button type="button"
      on:click={deleteMeetup}>
        Delete
    </Button>
  {/if}
</div>

</Modal>

<style>
  form {
    width: 100%;
  }
</style>
