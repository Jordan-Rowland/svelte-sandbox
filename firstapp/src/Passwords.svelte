<script>
  export let password = "";
  export let passwords = []

  function storePassword() {
    if (
        password.length >= 5
        && password.length <= 10
        ) {
      passwords = [...passwords, password]
    }
  }

  function removePassword(index) {
    passwords = passwords.filter(
      (password, idx) => idx !== index
    );
  };
</script>

<input type="text" bind:value={password}>

{#if password.length < 5}
  <p>Password is too short</p>
{:else if password.length > 10}
  <p>Password is too long</p>
{:else}
  <p>{password}</p>
{/if}

<button on:click={storePassword}>Store Password</button>

<ul>
{#each passwords as pass, index (index)}
  <li on:click={removePassword.bind(this, index)}>{pass}</li>
{/each}
</ul>

<style>

</style>
