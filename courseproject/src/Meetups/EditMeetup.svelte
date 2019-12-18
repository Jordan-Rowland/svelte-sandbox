<script>
  import { createEventDispatcher } from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import {
    notEmpty,
    isValidEmail
  } from "../helpers/validation.js";


  const dispatch = createEventDispatcher();

  let title = "";
  $: titleValid = notEmpty(title);
  let subtitle = "";
  $: subtitleValid = notEmpty(subtitle);
  let address = "";
  $: addressValid = notEmpty(address);
  let imageUrl = "";
  $: imageUrlValid = notEmpty(imageUrl);
  let contact = "";
  $: contactValid = isValidEmail(contact);
  // $: contactValid = notEmpty(contact);
  let description = "";
  $: descriptionValid = notEmpty(description);

  $: formIsValid = (
    titleValid &&
    subtitleValid &&
    addressValid &&
    imageUrlValid &&
    contactValid &&
    descriptionValid
  );

  function submitForm() {
    dispatch("addnewevent", {
      title,
      subtitle,
      description,
      address,
      contact,
      imageUrl,
    });
  }

  function cancelForm() {
    dispatch("cancelmodal");
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
</div>

</Modal>

<style>
  form {
    width: 100%;
  }
</style>
