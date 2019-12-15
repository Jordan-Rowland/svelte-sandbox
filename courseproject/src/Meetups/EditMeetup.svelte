<script>
  import { createEventDispatcher } from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";

  const dispatch = createEventDispatcher();

  let title = "";
  let subtitle = "";
  let description = "";
  let address = "";
  let contact = "";
  let imageUrl = "";

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
    dispatch("cancelmodal")
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
    value={title} on:input="{
      event => title = event.target.value
    }"
    />
  <TextInput
    id="subtitle"
    label="Subtitle"
    value={subtitle} on:input="{
      event => subtitle = event.target.value
    }"
    />
  <TextInput
    id="address"
    label="Address"
    value={address} on:input="{
      event => address = event.target.value
    }"
    />
  <TextInput
    id="imageUrl"
    label="Image URL"
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
    rows=3
    value={description} on:input="{
      event => description = event.target.value
    }"
    />
</form>

<div slot="footer">
  <Button type="button"
    mode="outline"
    on:click={cancelForm}>Cancel</Button>
  <Button type="button" on:click={submitForm}>Save</Button>
</div>

</Modal>

<style>
  form {
    width: 100%;
  }
</style>
