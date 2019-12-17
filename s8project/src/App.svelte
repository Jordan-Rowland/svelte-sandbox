<script>

  import CustomInput from "./CustomInput.svelte";

  let val = "";
  let price = 0;
  let agreed;
  let faveColor;
  let usernameInput;

  $: console.log(val);
  $: console.log(price);
  $: console.log(agreed);
  $: console.log(faveColor);

  function setValue(event) {
    val = event.target.value;
  }

  function saveData() {
    // This is possible, but not very svelte
    console.log(usernameInput.value);
  }

</script>

<!-- <h1>Bindings & Forms</h1>

<input type="text" bind:value={val}> -->


<CustomInput bind:val={val}/>

<input type="number"
  bind:value={price}>

  <label>
  <input type="checkbox" bind:checked={agreed} name="" id="">
  Agree to terms</label>

  <label>
  <input type="radio" name="color" value="red"
    bind:group={faveColor}>
    Red
  </label>

  <label>
  <input type="radio" name="color" value="green"
    bind:group={faveColor}>
    Green
  </label>

  <label>
  <input type="radio" name="color" value="blue"
    bind:group={faveColor}>
    Blue
  </label>

  <select bind:value={faveColor}>
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
  </select>

  <!-- Using bind:this=}{<variable>} is a way to get
  one-way binding -->
  <input type="text" id="username" bind:this={usernameInput}>
  <button on:click={saveData}>Save</button>

<style>



</style>
