<script>
  import ContactCard from "./ContactCard.svelte";
  import Passwords from "./Passwords.svelte";

  let name = "Max";
  let title = "";
  let image = "";
  let description = "";
  let done = false;

  let createdContacts = [];

  function addContact() {
    if (name
    && title
    && image
    && description) {
      // Use spread operator to re-assign and create
    // 'reactive' array.
      createdContacts = [
        ...createdContacts, {
          id: Math.random(),
          name,
          title,
          image,
          description
        }
      ];
      done = true;
      return;
    };
  };

  function deleteFirst() {
    createdContacts = createdContacts.slice(1);
  }

  function deleteLast() {
    createdContacts = createdContacts.slice(0, -1);
  }
</script>


<div id="form">
  <div class="form-control">
    <label for="userName">User Name</label>
    <input type="text" bind:value={name} id="userName" />
  </div>
  <div class="form-control">
    <label for="jobTitle">Job Title</label>
    <input type="text" bind:value={title} id="jobTitle" />
  </div>
  <div class="form-control">
    <label for="image">Image URL</label>
    <input type="text" bind:value={image} id="image" />
  </div>
  <div class="form-control">
    <label for="desc">Description</label>
    <textarea rows="3" bind:value={description} id="desc" />
  </div>
</div>

<!-- Modifiers - Add a | after the on:click -->
<button on:click|once={addContact}>
  Add Contact Card
</button>
<button on:click={deleteFirst}>Delete first</button>
<button on:click={deleteLast}>Delete last</button>

{#if !done}
  <h3>Please fill out the forms and click the button to generate</h3>
{/if}

{#each createdContacts as contact, index (contact.id)}
  <h2># {index + 1}</h2>
  <ContactCard
    userName={contact.name}
    jobTitle={contact.title}
    description={contact.description}
    userImage={contact.image} />
{:else}
  <p>Please create some cards!</p>
{/each}

<!-- <Passwords /> -->

<style>
  #form {
    width: 30rem;
    max-width: 100%;
  }
</style>
