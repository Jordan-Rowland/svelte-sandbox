<script>
  /* jshint esversion: 6 */
  export let name;
  let count = 0;

  const countUp = () => count += 1;
  let lister = [1,2,3];
  const addMore = () => {
    lister = [...lister, lister.length + 1];
  };

  $: upperCaseName = name.toUpperCase()

  $: console.log(count);

  $: counter = count * 2;
</script>


<style>
    h1 {
        color: purple;
    }
</style>

<h1>Hello {upperCaseName}!</h1>
{count} <button on:click={countUp}>Add one</button>

<p on:click={addMore}>
{lister}
</p>

{counter}
