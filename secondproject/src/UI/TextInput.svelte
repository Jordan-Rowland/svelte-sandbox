<script>
  export let controlType;
  export let id;
  export let label;
  export let rows;
  export let value;
  export let type;
</script>

<div class="from-control">
  <label for="{id}">{label}</label>
{#if controlType === "textarea"}
  <textarea rows={rows} id="{id}"
    value={value} on:input/>
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
  <input type="{type}" id="{id}" value={value} on:input>
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
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .form-control {
    padding: 0.5rem 0;
    width: 100%;
    margin: 0.25rem 0;
  }
</style>
