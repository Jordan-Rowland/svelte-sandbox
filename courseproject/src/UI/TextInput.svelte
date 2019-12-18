<script>
  export let controlType = null;
  export let id;
  export let label;
  export let rows = 3;
  export let value;
  export let type = "text";
  export let valid = true;
  export let validityMessage = "";

  let touched = false;
</script>

<div class="from-control">
  <label for="{id}">{label}</label>
{#if controlType === "textarea"}
  <textarea rows={rows} id="{id}"
    class:invalid={!valid && touched}
    bind:value on:blur={() => touched = true} />
    <!--
    bind:value does not work on components like this
    that are used inside other components where the
    value is coming from. Instead, use the
    value={value} syntax, and on:input without assigning
    anything to it. When using on:input without
    assignment, input gets forwarded to the parent
    component.
     -->
{:else}
  <input class:invalid={!valid && touched} {type} {id} {value} on:input
  on:blur={() => touched = true} >
{/if}

{#if validityMessage && !valid && touched}
  <p class="error-message">{validityMessage}</p>
{/if}

</div>

<style>
  input,
  textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: none;
    border-bottom: 2px solid #ccc;
    border-radius: 3px 3px 0 0;
    background: white;
    padding: 0.15rem 0.25rem;
    transition: border-color 0.1s ease-out;
  }

  input:focus,
  textarea:focus {
    border-color: #e40763;
    outline: none;
  }

  label {
    display: block;
    margin-top: 0.5rem;
    width: 100%;
  }

  .form-control {
    padding: 0.5rem 0;
    width: 100%;
    margin: 0.25rem 0;
  }

  .invalid {
    border-color: red;
    background: #FDE3E3;
  }

  .error-message {
    color: red;
    margin: 0.25rem 0;
    font-size: 0.75rem;
  }
</style>
